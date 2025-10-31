import { Optional } from "sequelize";
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
import { ProductoSchema } from "src/Producto";

export interface IImageSchema {
  id: number;
  nombre: string;
  url: string;
  productoId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IImageCreateSchema
  extends Optional<IImageSchema, "id" | "createdAt" | "updatedAt"> {}

@Table({ tableName: "imagenes", timestamps: true })
export class ImageSchema extends Model<IImageSchema, IImageCreateSchema> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column(DataType.STRING)
  url: string;

  @Column(DataType.INTEGER)
  productoId: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BelongsTo(() => ProductoSchema, "productoId")
  producto: ProductoSchema;
}
