import { Image } from "src/Image";

export interface Producto {
  id: number;
  nombre: string;
  unidadesMetroLineal: number;
  totales: number;
  disponibles: number;
  medidas: {
    altura: number;
    ancho?: number;
    profundidad?: number;
    diametro?: number;
  };
  costo: {
    producto: number;
    grafica: number;
    diseno: number;
    total: number;
  };
  valor: {
    unitarioGarantia: number;
    unitarioAlquiler: number;
    x1: number;
    x3: number;
    x6: number;
    x12: number;
  };
  image?: Image;
}

export type ProductoCreate = {
  id?: number;
  nombre: string;
  metroLineal: number;
  totales: number;
  disponibles: number;
  altura: number;
  ancho?: number;
  profundidad?: number;
  diametro?: number;
  valorUnitarioGarantia: number;
  valorUnitarioAlquiler: number;
  valorX1: number;
  valorX3: number;
  valorX6: number;
  valorX12: number;
};
