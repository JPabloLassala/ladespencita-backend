import { ProductoEntity } from "src/Producto";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { AlquilerEntity } from "src/Alquiler/alquiler.entity";

@Entity({ name: "alquiler_productos" })
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
  unidadesAlquiladas: number;
  @Column()
  unidadesCotizadas: number;
  @Column()
  cantidad: number;
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

  @OneToOne(() => ProductoEntity)
  @JoinColumn({ name: "productoId" })
  producto: ProductoEntity;
  @ManyToOne(() => AlquilerEntity, a => a.productos)
  @JoinColumn({ name: "alquilerId" })
  alquiler: AlquilerEntity;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt?: Date;
}

export type AlquilerProductoCreate = Omit<
  AlquilerProductoEntity,
  "id" | "createdAt" | "updatedAt" | "producto" | "alquiler"
> & { productoId: number; alquilerId: number };

export type AlquilerProductoUpdate = Partial<AlquilerProductoEntity> & {
  id: number;
};
