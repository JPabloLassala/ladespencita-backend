import { ProductoSchema } from "src/Productos";
import mongoose from "mongoose";
import { AlquilerProducto } from "./alquiler.entity";

const AlquilerProductoSchema = new mongoose.Schema({
  producto: ProductoSchema,
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
});

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
  { timestamps: true, collection: "alquileres" },
);

export class AlquilerRecordDTO {
  productora: string;
  proyecto: string;
  productos: AlquilerProducto[];
  fechaPresupuesto: Date;
  fechaAlquiler: {
    inicio: Date;
    fin: Date;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
