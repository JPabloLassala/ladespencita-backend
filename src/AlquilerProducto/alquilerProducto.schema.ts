import { AlquilerProducto } from "./alquilerProducto.entity";
import { IProductoSchema, Producto, ProductoSchema } from "src/Producto";
import { Alquiler, AlquilerSchema, IAlquilerSchema } from "src/Alquiler";
import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from "sequelize-typescript";
import { Optional } from "sequelize";

export interface IAlquilerProductoSchema {
  id: number;
  producto: IProductoSchema;
  alquiler: IAlquilerSchema;
  productoId: number;
  alquilerId: number;
  costoProducto: number;
  costoGrafica: number;
  costoDiseno: number;
  costoTotal: number;
  unidadesAlquiladas: number;
  unidadesCotizadas: number;
  cantidad: number;
  valorUnitarioGarantia: number;
  valorTotalGarantia: number;
  valorUnitarioAlquiler: number;
  valorX1: number;
  valorX3: number;
  valorX6: number;
  valorX12: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAlquilerProductoCreateSchema
  extends Optional<
    IAlquilerProductoSchema,
    "id" | "createdAt" | "updatedAt" | "producto" | "alquiler"
  > {}

export interface IAlquilerProductoUpdateSchema
  extends Optional<IAlquilerProductoSchema, "createdAt" | "updatedAt" | "producto" | "alquiler"> {}

@Table({ tableName: "alquiler_productos" })
export class AlquilerProductoSchema extends Model<
  IAlquilerProductoSchema,
  IAlquilerProductoCreateSchema
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @BelongsTo(() => ProductoSchema, "productoId")
  producto: ProductoSchema;
  @BelongsTo(() => AlquilerSchema, "alquilerId")
  alquiler: AlquilerSchema;

  @Column(DataType.INTEGER)
  productoId: number;
  @Column(DataType.INTEGER)
  alquilerId: number;
  @Column(DataType.INTEGER)
  costoProducto: number;
  @Column(DataType.INTEGER)
  costoGrafica: number;
  @Column(DataType.INTEGER)
  costoDiseno: number;
  @Column(DataType.INTEGER)
  costoTotal: number;
  @Column(DataType.INTEGER)
  unidadesAlquiladas: number;
  @Column(DataType.INTEGER)
  unidadesCotizadas: number;
  @Column(DataType.INTEGER)
  cantidad: number;
  @Column(DataType.INTEGER)
  valorUnitarioGarantia: number;
  @Column(DataType.INTEGER)
  valorTotalGarantia: number;
  @Column(DataType.INTEGER)
  valorUnitarioAlquiler: number;
  @Column(DataType.INTEGER)
  valorX1: number;
  @Column(DataType.INTEGER)
  valorX3: number;
  @Column(DataType.INTEGER)
  valorX6: number;
  @Column(DataType.INTEGER)
  valorX12: number;

  @CreatedAt
  createdAt: Date;
  @UpdatedAt
  updatedAt: Date;
}

export const fromSchemaToAlquilerProducto = (schema: AlquilerProductoSchema): AlquilerProducto => {
  return {
    id: schema.id,
    alquilerId: schema.alquilerId,
    productoId: schema.productoId,
    costo: {
      diseno: schema.costoDiseno,
      grafica: schema.costoGrafica,
      producto: schema.costoProducto,
      total: schema.costoTotal,
    },
    unidadesAlquiladas: schema.unidadesAlquiladas,
    unidadesCotizadas: schema.unidadesCotizadas,
    cantidad: schema.cantidad,
    valor: {
      totalGarantia: schema.valorTotalGarantia,
      unitarioAlquiler: schema.valorUnitarioAlquiler,
      unitarioGarantia: schema.valorUnitarioGarantia,
      x1: schema.valorX1,
      x3: schema.valorX3,
      x6: schema.valorX6,
      x12: schema.valorX12,
    },
  };
};

export const fromAlquilerProductoToSchema = (ap: AlquilerProducto): AlquilerProductoSchema => {
  return new AlquilerProductoSchema({
    id: ap.id,
    productoId: ap.productoId,
    alquilerId: ap.alquilerId,
    costoDiseno: ap.costo.diseno,
    costoGrafica: ap.costo.grafica,
    costoProducto: ap.costo.producto,
    costoTotal: ap.costo.total,
    unidadesAlquiladas: ap.unidadesAlquiladas,
    unidadesCotizadas: ap.unidadesCotizadas,
    cantidad: ap.cantidad,
    valorTotalGarantia: ap.valor.totalGarantia,
    valorUnitarioAlquiler: ap.valor.unitarioAlquiler,
    valorUnitarioGarantia: ap.valor.unitarioGarantia,
    valorX1: ap.valor.x1,
    valorX3: ap.valor.x3,
    valorX6: ap.valor.x6,
    valorX12: ap.valor.x12,
  });
};

export const fromAlquilerProductoToUpdateSchema = (
  ap: AlquilerProducto,
): IAlquilerProductoUpdateSchema => {
  return {
    id: ap.id,
    productoId: ap.productoId,
    alquilerId: ap.alquilerId,
    costoDiseno: ap.costo.diseno,
    costoGrafica: ap.costo.grafica,
    costoProducto: ap.costo.producto,
    costoTotal: ap.costo.total,
    unidadesAlquiladas: ap.unidadesAlquiladas,
    unidadesCotizadas: ap.unidadesCotizadas,
    cantidad: ap.cantidad,
    valorTotalGarantia: ap.valor.totalGarantia,
    valorUnitarioAlquiler: ap.valor.unitarioAlquiler,
    valorUnitarioGarantia: ap.valor.unitarioGarantia,
    valorX1: ap.valor.x1,
    valorX3: ap.valor.x3,
    valorX6: ap.valor.x6,
    valorX12: ap.valor.x12,
  };
};

export const fromAlquilerProductoToCreateSchema = (
  ap: AlquilerProducto,
): IAlquilerProductoCreateSchema => {
  return {
    id: ap.id,
    productoId: ap.productoId,
    alquilerId: ap.alquilerId,
    costoDiseno: ap.costo.diseno,
    costoGrafica: ap.costo.grafica,
    costoProducto: ap.costo.producto,
    costoTotal: ap.costo.total,
    unidadesAlquiladas: ap.unidadesAlquiladas,
    unidadesCotizadas: ap.unidadesCotizadas,
    cantidad: ap.cantidad,
    valorTotalGarantia: ap.valor.totalGarantia,
    valorUnitarioAlquiler: ap.valor.unitarioAlquiler,
    valorUnitarioGarantia: ap.valor.unitarioGarantia,
    valorX1: ap.valor.x1,
    valorX3: ap.valor.x3,
    valorX6: ap.valor.x6,
    valorX12: ap.valor.x12,
  };
};

export const fromProductoToAlquilerProducto = (
  producto: Producto,
  alquiler: Alquiler,
  cantidad: number,
  unidadesAlquiladas: number,
  unidadesCotizadas: number,
): AlquilerProducto => {
  return {
    productoId: +producto.id,
    alquilerId: +alquiler.id,
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
      totalGarantia: 0,
      unitarioAlquiler: producto.valor.unitarioAlquiler,
      x1: producto.valor.x1,
      x3: producto.valor.x3,
      x6: producto.valor.x6,
      x12: producto.valor.x12,
    },
  };
};
