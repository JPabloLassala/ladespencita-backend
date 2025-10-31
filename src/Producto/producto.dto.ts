import { ProductoEntity } from "./producto.entity";

export type ProductoCreateDTO = Omit<ProductoEntity, "id" | "image"> & {
  file?: Express.Multer.File;
};
export type ProductoUpdateDTO = Partial<ProductoCreateDTO>;
