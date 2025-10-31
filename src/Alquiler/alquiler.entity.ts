import { AlquilerProductoEntity } from "src/AlquilerProducto";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ALQUILER_STATUS } from "./alquiler.const";

@Entity({ name: "alquileres" })
export class AlquilerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productora: string;

  @Column()
  proyecto: string;

  @Column({ type: "varchar", default: ALQUILER_STATUS.PENDING })
  status: ALQUILER_STATUS;

  @Column()
  fechaPresupuesto: Date;

  @Column()
  fechaInicio: Date;

  @Column()
  fechaFin: Date;

  @OneToMany(() => AlquilerProductoEntity, ap => ap.alquiler)
  productos: AlquilerProductoEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export type AlquilerCreate = Omit<AlquilerEntity, "id" | "createdAt" | "updatedAt" | "productos">;
export type AlquilerUpdate = Partial<AlquilerEntity>;
