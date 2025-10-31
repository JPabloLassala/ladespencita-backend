import { ProductoEntity } from "src/Producto";
import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

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

  @OneToOne(() => ProductoEntity, "productoId")
  producto: ProductoEntity;
}
