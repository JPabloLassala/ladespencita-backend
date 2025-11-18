import { ProductoEntity } from "src/Producto";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  Unique,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { AlquilerEntity } from "src/Alquiler/alquiler.entity";

@Entity({ name: "alquiler_productos" })
@Unique("uq_alquiler_producto", ["productoId", "alquilerId"])
export class AlquilerProductoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productoId: number;
  @Column()
  alquilerId: number;
  @Column()
  costoProducto: number;
  @Column()
  costoGrafica: number;
  @Column()
  costoDiseno: number;
  @Column()
  costoTotal: number;
  @Column()
  cantidad: number;
  @Column({ nullable: false, default: 0 })
  precioFinal: number;
  @Column()
  valorUnitarioGarantia: number;
  @Column()
  valorTotalGarantia: number;
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

  @ManyToOne(() => ProductoEntity)
  @JoinColumn({ name: "productoId" })
  producto: ProductoEntity;
  @ManyToOne(() => AlquilerEntity, a => a.productos)
  @JoinColumn({ name: "alquilerId" })
  alquiler: AlquilerEntity;

  @CreateDateColumn({ nullable: false, default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
  @UpdateDateColumn({ nullable: true, default: () => "CURRENT_TIMESTAMP" })
  updatedAt?: Date;
}

export type AlquilerProductoCreate = Omit<
  AlquilerProductoEntity,
  "id" | "createdAt" | "updatedAt" | "producto" | "alquiler"
> & { productoId: number; alquilerId: number };

export type AlquilerProductoUpdate = Omit<
  AlquilerProductoEntity,
  "updatedAt" | "producto" | "alquiler"
>;
