import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { ImageEntity } from "src/modules/image";
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "productos" })
export class ProductoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index("idx_productos_nombre")
  @IsString()
  nombre: string;

  @Column()
  @IsNumber()
  @IsPositive()
  unidadesMetroLineal: number;

  @Column()
  @IsNumber()
  @IsPositive()
  totales: number;

  @Column({ nullable: true })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  medidasAltura: number;

  @Column({ nullable: true })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  medidasAncho?: number;

  @Column({ nullable: true })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  medidasProfundidad?: number;

  @Column({ nullable: true })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  medidasDiametro?: number;

  @Column()
  @IsNumber()
  @IsPositive()
  costoProducto: number;

  @Column()
  @IsNumber()
  @IsPositive()
  costoGrafica: number;

  @Column()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  costoDiseno?: number;

  @Column()
  @IsNumber()
  @IsPositive()
  costoTotal: number;

  @Column()
  @IsNumber()
  @IsPositive()
  valorUnitarioGarantia: number;

  @Column()
  @IsNumber()
  @IsPositive()
  valorUnitarioAlquiler: number;

  @Column()
  @IsNumber()
  @IsPositive()
  valorX1?: number;

  @Column()
  @IsNumber()
  @IsPositive()
  valorX3: number;

  @Column()
  @IsNumber()
  @IsPositive()
  valorX6: number;

  @Column()
  @IsNumber()
  @IsPositive()
  valorX12: number;

  @OneToMany(() => ImageEntity, p => p.producto)
  images: ImageEntity[];

  @CreateDateColumn({ nullable: false, default: () => "CURRENT_TIMESTAMP" })
  @Type(() => Date)
  createdAt: Date;

  @UpdateDateColumn({ nullable: true, default: () => "CURRENT_TIMESTAMP" })
  @Type(() => Date)
  updatedAt?: Date;
}

export type ProductoEntityCreate = Omit<
  ProductoEntity,
  "id" | "createdAt" | "updatedAt" | "images"
>;
export type ProductoEntityUpdate = Partial<ProductoEntityCreate> & { id: number };
