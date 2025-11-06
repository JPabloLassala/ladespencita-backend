import { Injectable } from "@nestjs/common";
import * as XLSX from "xlsx";
import { readFileSync } from "fs";
import { ProductoEntity, ProductoEntityCreate } from "src/Producto";

@Injectable()
export class SheetService {
  async parseExcel(filePath: string): Promise<any> {
    const columnV = new Map<string, keyof ProductoEntityCreate>([
      ["B", "nombre"],
      ["C", "unidadesMetroLineal"],
      ["D", "medidasAltura"],
      ["F", "totales"],
      ["J", "costoProducto"],
      ["K", "costoGrafica"],
      ["L", "costoDiseno"],
      ["T", "valorUnitarioAlquiler"],
    ]);
    const columnF = new Map<string, keyof ProductoEntityCreate>([
      ["B", "nombre"],
      ["C", "unidadesMetroLineal"],
      ["D", "medidasAltura"],
      ["F", "totales"],
      ["J", "costoProducto"],
      ["K", "costoGrafica"],
      ["L", "costoDiseno"],
      ["M", "costoTotal"],
      ["N", "valorUnitarioGarantia"],
      ["T", "valorUnitarioAlquiler"],
    ]);

    const buffer = readFileSync(filePath);
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = "INVENTARIOPLANTILLA PRESUPUESTO";
    const sheet = workbook.Sheets[sheetName];
    const rows2 = Object.entries(sheet).reduce((acc, [key, value]) => {
      const number = parseInt(key.replace(/[^0-9]/g, ""), 10);
      const col = key.replace(/[0-9]/g, "");
      if (number < 5) return acc;
      const row = acc.get(number) || {};
      if (!row) {
        acc.set(number, []);
      }
      acc.set(number, { ...row, [col]: value });

      return acc;
    }, new Map<number, any>());
    // console.log("producto", rows2.get(5));
    // console.log("producto", rows2.get(6));

    const productos: any[] = Array.from(rows2).map(([, row]) => {
      return Object.entries(row).reduce((acc, [letter, value]: [string, any]) => {
        const key = columnV.get(letter);
        if (!key) return acc;
        const keyF = columnF.get(letter);

        acc[key] = (value as XLSX.CellObject)?.v;
        return acc;
      }, {});
    });
    console.log("productoData", productos);

    return { asda: "asda" };
  }
}
