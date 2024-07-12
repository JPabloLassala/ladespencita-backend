import mongoose from "mongoose";
import { Producto } from "./producto.entity";

export const ProductoSchemaProps = {
  nombre: String,
  unidadesMetroLineal: Number,
  stock: Number,
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

export interface ProductoRecordDTO extends Document {
  _id?: string;
  nombre: string;
  unidadesMetroLineal: number;
  stock: number;
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

export const fromDtoToProducto = (dto: ProductoRecordDTO): Producto => {
  return {
    id: dto._id,
    nombre: dto.nombre,
    unidadesMetroLineal: dto.unidadesMetroLineal,
    stock: dto.stock,
    medidas: dto.medidas,
    costo: dto.costo,
    valor: dto.valor,
  };
};

export const fromProductoToDto = (producto: Producto): ProductoRecordDTO => {
  const productoModel = mongoose.model<ProductoRecordDTO>("Producto", ProductoSchema);

  return new productoModel({
    _id: new mongoose.Types.ObjectId(producto.id),
    nombre: producto.nombre,
    stock: producto.stock,
    unidadesMetroLineal: producto.unidadesMetroLineal,
    medidas: producto.medidas,
    costo: producto.costo,
    valor: producto.valor,
  });
};
