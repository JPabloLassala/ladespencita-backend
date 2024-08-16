import mongoose, { Document } from "mongoose";
import { Alquiler } from "./alquiler.entity";

export const AlquilerSchema = new mongoose.Schema(
  {
    productora: String,
    proyecto: String,
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

export interface AlquilerRecordDTO extends Document {
  _id?: string;
  productora: string;
  proyecto: string;
  fechaPresupuesto: Date;
  fechaAlquiler: {
    inicio: Date;
    fin: Date;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export const fromDtoToAlquiler = (dto: AlquilerRecordDTO): Alquiler => {
  return {
    id: dto._id,
    productora: dto.productora,
    proyecto: dto.proyecto,
    fechaPresupuesto: dto.fechaPresupuesto,
    fechaAlquiler: dto.fechaAlquiler,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
};

export const fromAlquilerToDto = (producto: Alquiler): AlquilerRecordDTO => {
  const alquilerModel = mongoose.model<AlquilerRecordDTO>("Alquiler", AlquilerSchema);

  return new alquilerModel({
    _id: producto.id,
    productora: producto.productora,
    proyecto: producto.proyecto,
    fechaPresupuesto: producto.fechaPresupuesto,
    fechaAlquiler: producto.fechaAlquiler,
    createdAt: producto.createdAt,
    updatedAt: producto.updatedAt,
  });
};
