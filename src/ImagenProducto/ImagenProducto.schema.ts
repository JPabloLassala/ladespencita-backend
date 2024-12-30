import { Model, Optional } from "sequelize";
import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  PrimaryKey,
  UpdatedAt,
} from "sequelize-typescript";
import { ProductoSchema } from "src/Producto";

export interface IImagenProductoSchema {
  id: number;
  productoId: number;
  url: string;
  isMain: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IImagenProductoCreateSchema
  extends Optional<IImagenProductoSchema, "id" | "createdAt" | "updatedAt"> {}

export class ImagenProductoSchema extends Model<
  IImagenProductoSchema,
  IImagenProductoCreateSchema
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => ProductoSchema)
  @Column(DataType.INTEGER)
  productoId: number;

  @Column(DataType.STRING)
  url: string;

  @Column(DataType.BOOLEAN)
  isMain: boolean;

  @BelongsTo(() => ProductoSchema, "productoId")
  producto: ProductoSchema;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
