import { ImageEntity } from "src/Image";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "productos" })
export class ProductoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  unidadesMetroLineal: number;

  @Column()
  totales: number;

  @Column()
  medidasAltura: number;

  @Column()
  medidasAncho?: number;

  @Column()
  medidasProfundidad?: number;

  @Column()
  medidasDiametro?: number;

  @Column()
  costoProducto: number;

  @Column()
  costoGrafica: number;

  @Column()
  costoDiseno: number;

  @Column()
  costoTotal: number;

  @Column()
  valorUnitarioGarantia: number;

  @Column()
  valorUnitarioAlquiler: number;

  @Column()
  valorX1: number;

  @Column()
  valorX3: number;

  @Column()
  valorX6: number;

  @Column()
  valorX12: number;

  @OneToOne(() => ImageEntity, p => p.producto)
  image: ImageEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export type ProductoEntityCreate = Omit<ProductoEntity, "id" | "createdAt" | "updatedAt" | "image">;
export type ProductoEntityUpdate = Partial<ProductoEntityCreate>;
