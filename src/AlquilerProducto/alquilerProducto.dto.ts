import { Type } from "class-transformer";
import { AlquilerProductoEntity } from "./alquilerProducto.entity";
import { IsDate } from "class-validator";

export type AlquilerProductoCreateDTO = Omit<
  AlquilerProductoEntity,
  "id" | "createdAt" | "updatedAt" | "producto" | "alquiler"
> & { productoId: number; alquilerId: number };

export type AlquilerProductoUpdateDTO = Omit<
  AlquilerProductoEntity,
  "updatedAt" | "producto" | "alquiler"
>;

export class CheckRemainingDto {
  @Type(() => Date)
  @IsDate()
  since: Date;

  @Type(() => Date)
  @IsDate()
  until: Date;
}
