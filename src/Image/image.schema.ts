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
} from "sequelize-typescript";
import { ProductoSchema } from "src/Producto";

export interface IImageSchema {
  id: number;
  nombre: string;
  url: string;
  isMain: boolean;
  productoId: number;
  createdAt: Date;
}

export interface IImageCreateSchema extends Optional<IImageSchema, "id" | "createdAt"> {}

@Table({ tableName: "imagenes", timestamps: true, updatedAt: false })
export class ImageSchema extends Model<IImageSchema, IImageCreateSchema> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column(DataType.STRING)
  url: string;

  @Column(DataType.INTEGER)
  productoId: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: true, field: "is_main" })
  isMain: boolean;

  @CreatedAt
  createdAt: Date;

  @BelongsTo(() => ProductoSchema, "productoId")
  producto: ProductoSchema;
}
