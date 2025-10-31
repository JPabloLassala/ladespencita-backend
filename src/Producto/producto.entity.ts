import { Transform } from "class-transformer";
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

export class ProductoCreate {
  id?: number;
  nombre: string;

  @Transform(({ value }) => +value)
  unidadesMetroLineal: number;
  @Transform(({ value }) => +value)
  metroLineal: number;
  @Transform(({ value }) => +value)
  totales: number;
  @Transform(({ value }) => +value)
  disponibles: number;
  @Transform(({ value }) => +value)
  altura: number;
  @Transform(({ value }) => +value)
  ancho?: number;
  @Transform(({ value }) => +value)
  profundidad?: number;
  @Transform(({ value }) => +value)
  diametro?: number;
  @Transform(({ value }) => +value)
  valorUnitarioGarantia: number;
  @Transform(({ value }) => +value)
  valorUnitarioAlquiler: number;
  @Transform(({ value }) => +value)
  valorx1: number;
  @Transform(({ value }) => +value)
  valorx3: number;
  @Transform(({ value }) => +value)
  valorx6: number;
  @Transform(({ value }) => +value)
  valorx12: number;
  file?: Express.Multer.File;

  constructor(obj: ProductoCreate) {
    Object.assign(this, obj);
  }
}
