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
    totalGarantia: number;
    unitarioAlquiler: number;
    x1: number;
    x3: number;
    x6: number;
    x12: number;
  };
  images: Image[];
}

export type ProductoCreate = Omit<Producto, "id" | "images">;
