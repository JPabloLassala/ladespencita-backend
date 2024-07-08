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
});
