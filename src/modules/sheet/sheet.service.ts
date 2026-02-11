import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Inject, Injectable, Logger, Provider } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import Dinero from "dinero.js";
import { XMLParser } from "fast-xml-parser";
import JSZip from "jszip";
import sharp from "sharp";
import { IMAGE_FORMAT, IMAGE_TYPE, S3 } from "src/common/constants";
import { ImageEntity } from "src/modules/image";
import { ProductoEntity, ProductoEntityCreate } from "src/modules/producto";
import { Repository } from "typeorm";
import * as XLSX from "xlsx";

@Injectable()
export class SheetService {
  constructor(
    @InjectRepository(ProductoEntity) private productoRepository: Repository<ProductoEntity>,
    @Inject(S3) private readonly s3: S3Client,
  ) {}

  columnToLetter(col: number) {
    let s = "";
    while (col >= 0) {
      s = String.fromCharCode((col % 26) + 65) + s;
      col = Math.floor(col / 26) - 1;
    }
    return s;
  }

  async parseExcel(file: Express.Multer.File): Promise<any> {
    const buffer = file.buffer;
    Logger.log(`Got buffer ${buffer.length}`, SheetService.name);
    const imagesWithNames = await this.extractJpegImagesWithNames(
      file.buffer,
      "INVENTARIOPLANTILLA PRESUPUESTO",
    );
    const imagesByRow = new Map<number, (typeof imagesWithNames)[number]>();
    const imagesByName = new Map<string, (typeof imagesWithNames)[number]>();
    for (const img of imagesWithNames) {
      const row = this.getRowFromCell(img.cell);
      if (row !== null && !imagesByRow.has(row)) imagesByRow.set(row, img);
      if (img.name) {
        const key = img.name.trim().toLowerCase();
        if (key && !imagesByName.has(key)) imagesByName.set(key, img);
      }
    }
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = "INVENTARIOPLANTILLA PRESUPUESTO";
    const sheet = workbook.Sheets[sheetName];

    const range = XLSX.utils.decode_range(sheet["!ref"] ?? "A1");
    const rowIndices: number[] = [];
    for (let rowIndex = 4; rowIndex <= range.e.r; rowIndex++) {
      rowIndices.push(rowIndex);
    }

    const parsedConcurrency = Number(process.env.SHEET_PARSE_CONCURRENCY ?? 4);
    const concurrency =
      Number.isFinite(parsedConcurrency) && parsedConcurrency > 0 ? parsedConcurrency : 4;

    const results = await this.mapWithConcurrency(rowIndices, concurrency, async rowIndex => {
      const excelRow = rowIndex + 1; // 1-based row number in the sheet
      const nombre = this.getCellValue(sheet, `B${excelRow}`);

      if (!nombre || `${nombre}`.trim().toLowerCase() === "producto") return null;

      const costoProducto = this.toNumber(this.getCellValue(sheet, `J${excelRow}`));
      if (costoProducto === null) return null;

      const producto: ProductoEntityCreate = {
        nombre: `${nombre}`.trim(),
        unidadesMetroLineal: this.toNumber(this.getCellValue(sheet, `C${excelRow}`)) ?? 0,
        medidasAltura: this.toMillimeters(this.getCellValue(sheet, `D${excelRow}`)),
        medidasAncho: undefined,
        medidasProfundidad: undefined,
        medidasDiametro: undefined,
        totales:
          this.toNumber(this.getCellValue(sheet, `F${excelRow}`)) ??
          this.toNumber(this.getCellValue(sheet, `E${excelRow}`)) ??
          0,
        costoProducto,
        costoGrafica: this.toNumber(this.getCellValue(sheet, `K${excelRow}`)) ?? 0,
        costoDiseno: this.toNumber(this.getCellValue(sheet, `L${excelRow}`)) ?? 0,
        costoTotal: this.toNumber(this.getCellValue(sheet, `M${excelRow}`)) ?? 0,
        valorUnitarioGarantia: this.toCents(this.getCellValue(sheet, `N${excelRow}`)) ?? 0,
        valorUnitarioAlquiler: this.toCents(this.getCellValue(sheet, `T${excelRow}`)) ?? 0,
        valorX1: this.toNumber(this.getCellValue(sheet, `O${excelRow}`)) ?? 0,
        valorX3: this.toNumber(this.getCellValue(sheet, `P${excelRow}`)) ?? 0,
        valorX6: this.toNumber(this.getCellValue(sheet, `Q${excelRow}`)) ?? 0,
        valorX12: this.toNumber(this.getCellValue(sheet, `R${excelRow}`)) ?? 0,
      };

      // Avoid inserting empty rows
      Logger.log(`Producto name: ${producto.nombre}`, SheetService.name);
      if (!producto.nombre) return null;

      const newProducto = await this.productoRepository.save(producto);
      Logger.log(`Parsed Producto ${newProducto.id}`, SheetService.name);

      const nameKey = producto.nombre.trim().toLowerCase();
      const imageForRow = imagesByRow.get(excelRow) ?? imagesByName.get(nameKey);

      if (imageForRow) {
        const savedImages = await this.uploadCompressedImage(imageForRow, newProducto.id);
        if (savedImages) {
          newProducto.images = savedImages;
        }
      }

      return newProducto;
    });

    const createdProductos = results.filter(
      (producto): producto is ProductoEntity => producto !== null,
    );

    return { created: createdProductos.length, productos: createdProductos };
  }

  async extractJpegImagesWithNames(buffer: Buffer, sheetName = "INVENTARIOPLANTILLA PRESUPUESTO") {
    const zip = await JSZip.loadAsync(new Uint8Array(buffer));

    const xmlFile = zip.file("content.xml");
    if (!xmlFile) throw new Error("content.xml not found");

    const xml = await xmlFile.async("string");

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "",
    });

    const json = parser.parse(xml);
    const spreadsheet = json["office:document-content"]?.["office:body"]?.["office:spreadsheet"];

    let sheets = spreadsheet["table:table"];
    if (!Array.isArray(sheets)) sheets = [sheets];

    const sheet = sheets.find(s => s["table:name"] === sheetName);
    if (!sheet) throw new Error(`Sheet "${sheetName}" not found`);

    const rows = sheet["table:table-row"];
    if (!rows) return [];

    const results: Array<{
      buffer: Buffer;
      cell: string;
      fileName: string;
      name: string | null; // <-- THE NEW FIELD
    }> = [];

    let rowIndex = 0;

    for (const row of rows) {
      let cells = row["table:table-cell"];
      if (!cells) {
        rowIndex++;
        continue;
      }

      if (!Array.isArray(cells)) cells = [cells];

      let colIndex = 0;

      for (const cell of cells) {
        const repeat = Number(cell["table:number-columns-repeated"] || 1);

        // IMAGE EXTRACTION
        if (cell["draw:frame"]) {
          const frames = Array.isArray(cell["draw:frame"])
            ? cell["draw:frame"]
            : [cell["draw:frame"]];

          for (const frame of frames) {
            const img = frame["draw:image"];
            if (!img) continue;

            const imgList = Array.isArray(img) ? img : [img];

            for (const i of imgList) {
              const href = i["xlink:href"];
              if (!href) continue;

              const lower = href.toLowerCase();
              if (!lower.endsWith(".jpg") && !lower.endsWith(".jpeg")) continue;

              const fixedPath = href.replace(/^\.?\//, "");
              const imgFile = zip.file(fixedPath);
              if (!imgFile) continue;

              const buffer = await imgFile.async("nodebuffer");

              // Compute cell location
              const excelCol = this.columnToLetter(colIndex);
              const excelRow = rowIndex + 1;
              const cellRef = `${excelCol}${excelRow}`;

              // --- NEW: Read the value in column B (colIndex 1) ---
              let name: string | null = null;
              const nameCell = cells[1]; // B column
              if (nameCell) {
                const textObj = nameCell["text:p"] ?? nameCell["office:value"] ?? null;

                if (typeof textObj === "string") {
                  name = textObj;
                } else if (Array.isArray(textObj)) {
                  name = textObj.join(" ");
                }
              }

              results.push({
                buffer,
                cell: cellRef,
                fileName: fixedPath.split("/").pop()!,
                name,
              });
            }
          }
        }

        colIndex += repeat;
      }

      rowIndex++;
    }

    return results;
  }

  private getCellValue(sheet: XLSX.WorkSheet, cell: string): any {
    return sheet[cell]?.v;
  }

  private toNumber(value: any): number | null {
    if (value === null || value === undefined || value === "") return null;
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      const cleaned = value.replace(",", ".").replace(/[^0-9.\-]/g, "");
      if (!cleaned) return null;
      const parsed = parseFloat(cleaned);
      return Number.isNaN(parsed) ? null : parsed;
    }
    return null;
  }

  private getRowFromCell(cell: string): number | null {
    const digits = cell.replace(/[^0-9]/g, "");
    return digits ? parseInt(digits, 10) : null;
  }

  private toCents(value: any): number | null {
    const parsed = this.toNumber(value);
    if (parsed === null) return null;

    return Dinero({
      amount: Math.round(parsed * 100),
      currency: "USD",
    }).getAmount();
  }

  private toMillimeters(value: any): number | null {
    if (value === null || value === undefined || value === "") return null;

    let rawStr = "";
    if (typeof value === "number") {
      rawStr = String(value);
    } else if (typeof value === "string") {
      rawStr = value;
    } else {
      return null;
    }

    const lower = rawStr.toLowerCase();
    const numericPart = lower.match(/-?\d+(?:[.,]\d+)?/);
    if (!numericPart) return null;

    const num = parseFloat(numericPart[0].replace(",", "."));

    let factor = 10; // default assume centimeters
    if (lower.includes("mm")) factor = 1;
    else if (lower.includes("cm")) factor = 10;
    else if (lower.includes("m")) factor = 1000;

    return Math.round(num * factor);
  }

  private async uploadCompressedImage(
    image: { buffer: Buffer; fileName: string },
    productoId: number,
  ): Promise<ImageEntity[]> {
    const [thumbBuffer, galleryBuffer, fullBuffer] = await Promise.all([
      sharp(image.buffer).resize(200).webp({ quality: 80 }).toBuffer(),
      sharp(image.buffer).resize(800).webp({ quality: 80 }).toBuffer(),
      sharp(image.buffer).webp({ quality: 80 }).toBuffer(),
    ]);
    const extension = "webp";
    const thumbKey = `${productoId}/${productoId}-200.${extension}`;
    const galleryKey = `${productoId}/${productoId}-800.${extension}`;
    const fullKey = `${productoId}/${productoId}-full.${extension}`;

    try {
      await Promise.all([
        this.s3.send(
          new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: thumbKey,
            ContentType: "image/webp",
            ContentLength: thumbBuffer.length,
            Body: thumbBuffer,
            CacheControl: "public, max-age=31536000",
          }),
        ),
        this.s3.send(
          new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: galleryKey,
            ContentType: "image/webp",
            ContentLength: galleryBuffer.length,
            Body: galleryBuffer,
            CacheControl: "public, max-age=31536000",
          }),
        ),
        this.s3.send(
          new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: fullKey,
            ContentType: "image/webp",
            ContentLength: fullBuffer.length,
            Body: fullBuffer,
            CacheControl: "public, max-age=31536000",
          }),
        ),
      ]);
    } catch (error) {
      console.error("Error uploading image to S3:", error);
      throw error;
    }
    const imageRepository = this.productoRepository.manager.getRepository(ImageEntity);

    const images = await imageRepository.save([
      {
        productoId,
        url: `${process.env.CDN_BASE_URL}/${fullKey}`,
        format: IMAGE_FORMAT.WEBP,
        type: IMAGE_TYPE.FULL,
        isMain: true,
      },
      {
        productoId,
        url: `${process.env.CDN_BASE_URL}/${galleryKey}`,
        format: IMAGE_FORMAT.WEBP,
        type: IMAGE_TYPE.GALLERY,
        isMain: false,
      },
      {
        productoId,
        url: `${process.env.CDN_BASE_URL}/${thumbKey}`,
        format: IMAGE_FORMAT.WEBP,
        type: IMAGE_TYPE.THUMBNAIL,
        isMain: false,
      },
    ]);

    return images;
  }

  private async mapWithConcurrency<T, R>(
    items: T[],
    limit: number,
    worker: (item: T, index: number) => Promise<R>,
  ): Promise<R[]> {
    if (items.length === 0) return [];

    const results = new Array<R>(items.length);
    let nextIndex = 0;
    const workerCount = Math.min(limit, items.length);

    const workers = Array.from({ length: workerCount }, async () => {
      while (true) {
        const currentIndex = nextIndex;
        if (currentIndex >= items.length) break;
        nextIndex += 1;
        results[currentIndex] = await worker(items[currentIndex], currentIndex);
      }
    });

    await Promise.all(workers);
    return results;
  }
}
