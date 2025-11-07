import { Injectable } from "@nestjs/common";
import * as XLSX from "xlsx";
import { readFileSync } from "fs";
import { ProductoEntity, ProductoEntityCreate } from "src/Producto";
import { get } from "http";

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

    const getProductoFromRow: (row: any) => ProductoEntityCreate = row => {
      const getValueInt = (cell: XLSX.CellObject) => parseInt(cell?.v as string);
      const getValue = (cell: XLSX.CellObject) => cell?.v as string;
      if (getValue(row?.B) === "Arveja lata") {
        console.log("Found Arveja lata:", row);
      }
      return {
        nombre: getValue(row?.B),
        unidadesMetroLineal: getValueInt(row?.C),
        medidasAltura: getValueInt(row?.D),
        totales: getValueInt(row?.F),
        costoProducto: getValueInt(row?.J),
        costoGrafica: getValueInt(row?.K),
        costoDiseno: getValueInt(row?.L),
        costoTotal: getValueInt(row?.J) + getValueInt(row?.K) + getValueInt(row?.L),
        valorUnitarioGarantia: getValueInt(row?.N),
        valorUnitarioAlquiler: getValueInt(row?.T),
        valorX1: getValueInt(row?.N) * 0.5,
        valorX3: getValueInt(row?.N) * 0.45,
        valorX6: getValueInt(row?.N) * 0.35,
        valorX12: getValueInt(row?.N) * 0.3,
      };
    };
    const productos: ProductoEntityCreate[] = Array.from(rows2.values()).map(getProductoFromRow);
    // console.log("productos", productos);

    return { productos };
  }
}
