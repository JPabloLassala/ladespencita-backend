import { ProductoRecordDTO, ProductoSchemaProps } from "src/Productos";
import mongoose, { Document } from "mongoose";
import { Alquiler } from "./alquiler.entity";

const AlquilerProductoSchema = new mongoose.Schema(
  {
    producto: new mongoose.Schema(ProductoSchemaProps, {
      _id: true,
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

export interface AlquilerProductoDTO {
  _id?: string;
  producto: ProductoRecordDTO;
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
}

export interface AlquilerRecordDTO extends Document {
  _id?: string;
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

export const fromDtoToAlquiler = (dto: AlquilerRecordDTO): Alquiler => {
  return {
    id: dto._id,
    productora: dto.productora,
    proyecto: dto.proyecto,
    productos: dto.productos.map((producto) => ({
      id: producto._id,
      producto: {
        id: producto.producto._id,
        stock: producto.producto.stock,
        nombre: producto.producto.nombre,
        unidadesMetroLineal: producto.producto.unidadesMetroLineal,
        medidas: producto.producto.medidas,
        costo: producto.producto.costo,
        valor: producto.producto.valor,
      },
      unidadesAlquiladas: producto.unidadesAlquiladas,
      unidadesCotizadas: producto.unidadesCotizadas,
      cantidad: producto.cantidad,
      valor: producto.valor,
    })),
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
    productos: producto.productos.map((producto) => ({
      _id: producto.id,
      producto: {
        _id: producto.producto.id,
        nombre: producto.producto.nombre,
        unidadesMetroLineal: producto.producto.unidadesMetroLineal,
        medidas: producto.producto.medidas,
        costo: producto.producto.costo,
        valor: producto.producto.valor,
      },
      unidadesAlquiladas: producto.unidadesAlquiladas,
      unidadesCotizadas: producto.unidadesCotizadas,
      cantidad: producto.cantidad,
      valor: producto.valor,
    })),
    fechaPresupuesto: producto.fechaPresupuesto,
    fechaAlquiler: producto.fechaAlquiler,
    createdAt: producto.createdAt,
    updatedAt: producto.updatedAt,
  });
};
