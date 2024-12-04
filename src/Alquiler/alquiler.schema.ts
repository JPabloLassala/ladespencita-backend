import { Optional } from "sequelize";
import { Alquiler } from "./alquiler.entity";
import {
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from "sequelize-typescript";
import { AlquilerProductoSchema, IAlquilerProductoSchema } from "src/AlquilerProducto";

export interface IAlquilerSchema {
  id: string;
  productora: string;
  proyecto: string;
  fechaPresupuesto: Date;
  fechaInicio: Date;
  fechaFin: Date;
  productos: IAlquilerProductoSchema[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IAlquilerCreateSchema
  extends Optional<IAlquilerSchema, "id" | "createdAt" | "updatedAt"> {}

@Table({ tableName: "alquileres", timestamps: true })
export class AlquilerSchema extends Model<IAlquilerSchema, IAlquilerCreateSchema> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: string;

  @Column(DataType.STRING)
  productora: string;
  @Column(DataType.STRING)
  proyecto: string;
  @Column(DataType.DATE)
  fechaPresupuesto: Date;
  @Column(DataType.DATE)
  fechaInicio: Date;
  @Column(DataType.DATE)
  fechaFin: Date;

  @HasMany(() => AlquilerProductoSchema, "alquilerId")
  productos: AlquilerProductoSchema[];

  @CreatedAt
  createdAt: Date;
  @UpdatedAt
  updatedAt: Date;
}

export const fromSchemaToAlquiler = (schema: AlquilerSchema): Alquiler => {
  return {
    id: schema.id,
    productora: schema.productora,
    proyecto: schema.proyecto,
    fechaPresupuesto: schema.fechaPresupuesto,
    fechaAlquiler: {
      inicio: schema.fechaInicio,
      fin: schema.fechaFin,
    },
    createdAt: schema.createdAt,
    updatedAt: schema.updatedAt,
  };
};

export const fromAlquilerToSchema = (alquiler: Alquiler | Partial<Alquiler>): AlquilerSchema => {
  return new AlquilerSchema({
    id: alquiler.id,
    productora: alquiler.productora,
    proyecto: alquiler.proyecto,
    fechaInicio: alquiler.fechaAlquiler.inicio,
    fechaFin: alquiler.fechaAlquiler.fin,
    createdAt: alquiler.createdAt,
    updatedAt: alquiler.updatedAt,
  });
};
