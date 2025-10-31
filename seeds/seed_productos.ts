import { ProductoSchema } from "src/Producto";
import { productos } from "./data/productos";

export async function seed_Products() {
  await ProductoSchema.destroy({ where: {}, truncate: true });
  console.log("Productos borrados");

  await ProductoSchema.bulkCreate(productos);
  console.log("Productos insertados");
}
