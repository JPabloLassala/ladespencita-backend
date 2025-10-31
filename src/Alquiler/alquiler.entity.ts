import { AlquilerProductoEntity } from "src/AlquilerProducto";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "alquileres" })
export class AlquilerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productora: string;

  @Column()
  proyecto: string;

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
