import { Alquiler } from "./alquiler.entity";
import {
  AutoIncrement,
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { AlquilerProducto, AlquilerProductoSchema } from "src/AlquilerProducto";

@Table({ tableName: "alquileres", timestamps: true })
export class AlquilerSchema extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id?: string;
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
  productos: AlquilerProducto[];
}

export interface AlquilerRecord {
  id?: string;
  productora: string;
  proyecto: string;
  fechaPresupuesto: Date;
  fechaInicio: Date;
  fechaFin: Date;
  productos: AlquilerProducto[];
}

export const fromSchemaToAlquiler = (dto: AlquilerSchema): Alquiler => {
  return {
    id: dto.id,
    productora: dto.productora,
    proyecto: dto.proyecto,
    fechaPresupuesto: dto.fechaPresupuesto,
    fechaAlquiler: {
      inicio: dto.fechaInicio,
      fin: dto.fechaFin,
    },
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
};

export const fromAlquilerToDto = (alquiler: Alquiler): AlquilerSchema => {
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
