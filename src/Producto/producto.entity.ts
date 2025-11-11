import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
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

  @OneToOne(() => ImageEntity, p => p.producto)
  image?: ImageEntity;

  @CreateDateColumn({ nullable: false, default: () => "CURRENT_TIMESTAMP" })
  @Type(() => Date)
  createdAt: Date;

  @UpdateDateColumn({ nullable: true, default: () => "CURRENT_TIMESTAMP" })
  @Type(() => Date)
  updatedAt?: Date;
}

export type ProductoEntityCreate = Omit<ProductoEntity, "id" | "createdAt" | "updatedAt" | "image">;
export type ProductoEntityUpdate = Partial<ProductoEntityCreate>;
