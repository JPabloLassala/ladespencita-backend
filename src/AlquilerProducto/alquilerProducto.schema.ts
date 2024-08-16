import mongoose from "mongoose";
import { AlquilerProducto } from "./alquilerProducto.entity";
import { Producto } from "src/Productos";
import { Alquiler } from "src/Alquileres";

export const AlquilerProductoSchema = new mongoose.Schema(
  {
    productoId: String,
    costo: {
      producto: Number,
      grafica: Number,
      diseno: Number,
      total: Number,
    },
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

export interface AlquilerProductoDTO {
  _id?: string;
  productoId: string;
  costo: {
    producto: number;
    grafica: number;
    diseno: number;
    total: number;
  };
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

export const fromDtoToAlquilerProducto = (dto: AlquilerProductoDTO): AlquilerProducto => {
  return {
    id: dto._id,
    productoId: dto.productoId,
    costo: dto.costo,
    unidadesAlquiladas: dto.unidadesAlquiladas,
    unidadesCotizadas: dto.unidadesCotizadas,
    cantidad: dto.cantidad,
    valor: dto.valor,
  };
};

export const fromAlquilerProductoToDto = (producto: AlquilerProducto): AlquilerProductoDTO => {
  const alquilerModel = mongoose.model<AlquilerProductoDTO>("Alquiler", AlquilerProductoSchema);

  return new alquilerModel({
    _id: producto.id,
    productoId: producto.productoId,
    costo: producto.costo,
    unidadesAlquiladas: producto.unidadesAlquiladas,
    unidadesCotizadas: producto.unidadesCotizadas,
    cantidad: producto.cantidad,
    valor: producto.valor,
  });
};

export const fromProductoToAlquilerProducto = (
  producto: Producto,
  alquiler: Alquiler,
  cantidad: number,
  unidadesAlquiladas: number,
  unidadesCotizadas: number,
): AlquilerProducto => {
  return {
    productoId: producto.id,
    cantidad,
    costo: {
      producto: producto.costo.producto,
      grafica: producto.costo.grafica,
      diseno: producto.costo.diseno,
      total: producto.costo.total,
    },
    unidadesAlquiladas,
    unidadesCotizadas,
    valor: {
      unitarioGarantia: producto.valor.unitarioGarantia,
      totalGarantia: producto.valor.totalGarantia,
      unitarioAlquiler: producto.valor.unitarioAlquiler,
      x1: producto.valor.x1,
      x3: producto.valor.x3,
      x6: producto.valor.x6,
      x12: producto.valor.x12,
    },
  };
};
