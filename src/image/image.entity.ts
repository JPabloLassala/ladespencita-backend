import { IMAGE_FORMAT, IMAGE_TYPE } from "src/constants";
import { ProductoEntity } from "src/producto";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "imagenes" })
export class ImageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column()
  productoId: number;

  @Column({ default: true, name: "is_main" })
  isMain: boolean;

  @Column({ type: "varchar", default: IMAGE_TYPE.GALLERY })
  type: IMAGE_TYPE;

  @Column({ type: "varchar", default: IMAGE_FORMAT.JPEG })
  format: IMAGE_FORMAT;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => ProductoEntity, p => p.images, { onDelete: "CASCADE" })
  @JoinColumn({ name: "productoId" })
  producto: ProductoEntity;
}
