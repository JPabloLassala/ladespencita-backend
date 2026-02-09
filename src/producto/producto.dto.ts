import { Transform } from "class-transformer";
import { ProductoEntity, ProductoEntityUpdate } from "./producto.entity";
import { IsObject } from "class-validator";

export type ProductoDTO = Omit<ProductoEntity, "id" | "image" | "createdAt" | "updatedAt">;

export class ProductoCreateDTO {
  file?: Express.Multer.File;

  @IsObject({ message: "body must be an object" })
  @Transform(({ value }) => {
    if (typeof value !== "string") return value;
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  })
  body: ProductoDTO;
}

export class ProductoUpdateDTO {
  file?: Express.Multer.File;

  @IsObject({ message: "body must be an object" })
  @Transform(({ value }) => {
    if (typeof value !== "string") return value;
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  })
  body: ProductoEntityUpdate;
}
