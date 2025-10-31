import { AlquilerProductoEntity } from "./alquilerProducto.entity";

export type AlquilerProductoCreateDTO = Omit<
  AlquilerProductoEntity,
  "id" | "createdAt" | "updatedAt" | "producto" | "alquiler"
> & { productoId: number; alquilerId: number };

export type AlquilerProductoUpdateDTO = Partial<AlquilerProductoCreateDTO> & {
  id: number;
};
