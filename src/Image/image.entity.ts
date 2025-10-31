import { ProductoEntity } from "src/Producto";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
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

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => ProductoEntity, p => p.image)
  @JoinColumn({ name: "productoId" })
  producto: ProductoEntity;
}
