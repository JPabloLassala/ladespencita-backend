import { Injectable } from "@nestjs/common";
import { OdsJpegRecord } from "./odsJpeg.type";
import { readFileSync } from "fs";
import JSZip from "jszip";
import { XMLParser } from "fast-xml-parser";

@Injectable()
export class SheetService {
  private parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "" });

  async extractJpegsFromSheet(odsPath: string, sheetName: string): Promise<OdsJpegRecord[]> {
    const raw = readFileSync(odsPath);
    const zip = await JSZip.loadAsync(new Uint8Array(raw)); // ✅ type-safe
    const contentXml = await zip.file("content.xml")!.async("string");
    const doc = this.parser.parse(contentXml);
    const spreadsheets = doc["office:document-content"]?.["office:body"]?.["office:spreadsheet"];
    const tables = ([] as any[]).concat(spreadsheets?.["table:table"] ?? []);
    if (tables.length === 0) return [];

    // Normalize the requested sheet name
    const norm = (s: string) => s?.replace(/\s+/g, " ").replace(/\//g, "").trim();
    const want = norm(sheetName);
    const table = tables.find(t => norm(t["table:name"]) === want);
    if (!table) return [];

    const results: OdsJpegRecord[] = [];
    let rowIndex = 0;

    const tableRows = ([] as any[]).concat(table["table:table-row"] ?? []);
    for (const row of tableRows) {
      const repeatRows = parseInt(row["table:number-rows-repeated"] ?? "1", 10) || 1;
      for (let r = 0; r < repeatRows; r++) {
        let colIndex = 0;
        const cells = ([] as any[]).concat(row["table:table-cell"] ?? []);
        for (const cell of cells) {
          const repeatCols = parseInt(cell["table:number-columns-repeated"] ?? "1", 10) || 1;
          const frames = ([] as any[]).concat(cell["draw:frame"] ?? []);

          for (const fr of frames) {
            const img = fr["draw:image"];
            if (!img) continue;
            const href: string | undefined = img["xlink:href"];
            if (!href || !href.match(/\.jpe?g$/i)) continue; // ✅ only JPEGs

            const path = href.replace(/^\.\//, "");
            const file = zip.file(path);
            if (!file) continue;

            const buf = await file.async("nodebuffer");
            const name = fr["draw:name"];
            const abs = {
              x: fr["svg:x"],
              y: fr["svg:y"],
              width: fr["svg:width"],
              height: fr["svg:height"],
            };

            const addr = this.addrFromIndices(rowIndex, colIndex);
            results.push({
              name,
              path,
              buffer: buf,
              anchoredToCell: true,
              cell: { row: rowIndex + 1, col: colIndex + 1, addr },
              abs,
            });
          }

          colIndex += repeatCols;
        }
        rowIndex++;
      }
    }

    // Floating JPEGs (outside table cells)
    const floating = this.findFrames(table).filter(fr => fr["draw:image"] && !fr.__cellAnchored);
    for (const fr of floating) {
      const img = fr["draw:image"];
      const href: string | undefined = img["xlink:href"];
      if (!href || !href.match(/\.jpe?g$/i)) continue; // ✅ JPEGs only

      const path = href.replace(/^\.\//, "");
      const file = zip.file(path);
      if (!file) continue;

      const buf = await file.async("nodebuffer");
      results.push({
        name: fr["draw:name"],
        path,
        buffer: buf,
        anchoredToCell: false,
        abs: {
          x: fr["svg:x"],
          y: fr["svg:y"],
          width: fr["svg:width"],
          height: fr["svg:height"],
        },
      });
    }

    return results;
  }

  private addrFromIndices(r: number, c: number): string {
    const col = this.numToCol(c + 1);
    return `${col}${r + 1}`;
  }

  private numToCol(n: number): string {
    let s = "";
    while (n > 0) {
      const rem = (n - 1) % 26;
      s = String.fromCharCode(65 + rem) + s;
      n = Math.floor((n - 1) / 26);
    }
    return s;
  }

  private findFrames(node: any, path: string[] = [], hits: any[] = []): any[] {
    if (!node || typeof node !== "object") return hits;
    const frames = ([] as any[]).concat(node["draw:frame"] ?? []);
    for (const fr of frames) {
      fr.__cellAnchored = path.includes("table:table-cell");
      hits.push(fr);
    }
    for (const k of Object.keys(node)) {
      if (k === "draw:frame") continue;
      this.findFrames(node[k], path.concat(k), hits);
    }
    return hits;
  }
}
