import { Producto, ProductoSchemaProps } from "src/Productos";
import mongoose from "mongoose";

const AlquilerProductoSchema = new mongoose.Schema(
  {
    producto: new mongoose.Schema(ProductoSchemaProps, {
      _id: false,
      versionKey: false,
      timestamps: false,
    }),
    unidadesAlquiladas: Number,
    unidadesCotizadas: Number,
    cantidad: Number,
    valor: {
      unitarioGarantia: Number,
      totalGarantia: Number,
      unitarioAlquiler: Number,
      x1: Number,
      x3: Number,
      x6: Number,
      x12: Number,
    },
  },
  {
    _id: false,
    versionKey: false,
    timestamps: false,
  },
);

export const AlquilerSchema = new mongoose.Schema(
  {
    productora: String,
    proyecto: String,
    productos: [AlquilerProductoSchema],
    fechaPresupuesto: Date,
    fechaAlquiler: new mongoose.Schema({
      inicio: Date,
      fin: Date,
    }),
  },
  {
    timestamps: true,
    collection: "alquileres",
    versionKey: false,
  },
);

export type AlquilerProductoDTO = {
  producto: Producto;
  unidadesAlquiladas: number;
  unidadesCotizadas: number;
  cantidad: number;
  valor: {
    unitarioGarantia: number;
    totalGarantia: number;
    unitarioAlquiler: number;
    x1: number;
    x3: number;
    x6: number;
    x12: number;
  };
};

export class AlquilerRecordDTO {
  productora: string;
  proyecto: string;
  productos: AlquilerProductoDTO[];
  fechaPresupuesto: Date;
  fechaAlquiler: {
    inicio: Date;
    fin: Date;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
