import { AlquilerProducto } from "./alquilerProducto.entity";
import { fromSchemaToProducto, Producto, ProductoSchema } from "src/Producto";
import { Alquiler, AlquilerSchema, fromSchemaToAlquiler } from "src/Alquiler";
import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

@Table({ tableName: "alquiler_productos" })
export class AlquilerProductoSchema extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id?: number;

  @BelongsTo(() => ProductoSchema, "productoId")
  producto: ProductoSchema;
  @BelongsTo(() => AlquilerSchema, "alquilerId")
  alquiler: AlquilerSchema;

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
}

export interface AlquilerProductoRecord {
  id?: number;
  producto: ProductoSchema;
  alquiler: AlquilerSchema;
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
}

export const fromSchemaToAlquilerProducto = (schema: AlquilerProductoSchema): AlquilerProducto => {
  return {
    id: schema.id,
    alquiler: fromSchemaToAlquiler(schema.alquiler),
    producto: fromSchemaToProducto(schema.producto),
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
    producto: ap.producto,
    alquiler: ap.alquiler,
    costo: ap.costo,
    unidadesAlquiladas: ap.unidadesAlquiladas,
    unidadesCotizadas: ap.unidadesCotizadas,
    cantidad: ap.cantidad,
    valor: ap.valor,
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
    producto: producto,
    alquiler: alquiler,
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
