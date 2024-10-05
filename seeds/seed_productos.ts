import { ProductoSchema } from "src/Producto";
import { productos } from "./data/productos";

export async function seed_Products() {
  await ProductoSchema.bulkCreate(productos);
  console.log("Productos insertados");
}
