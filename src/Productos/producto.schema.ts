import mongoose from "mongoose";

export const ProductoSchemaProps = {
  nombre: String,
  unidadesMetroLineal: Number,
  medidas: {
    altura: Number,
    ancho: Number,
    profundidad: Number,
    diametro: Number,
  },
  costo: {
    producto: Number,
    grafica: Number,
    diseno: Number,
    total: Number,
  },
  valor: {
    unitarioGarantia: Number,
    x1: Number,
    x3: Number,
    x6: Number,
    x12: Number,
  },
};

export const ProductoSchema = new mongoose.Schema(ProductoSchemaProps, {
  timestamps: true,
  versionKey: false,
});

export interface ProductoRecordDTO {
  _id?: string;
  nombre: string;
  unidadesMetroLineal: number;
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
    x1: number;
    x3: number;
    x6: number;
    x12: number;
  };
}
