import { ProductoEntity } from "src/producto";
import { productos } from "./data/productos";

export async function seed_Products(dataSource) {
  const productoRepository = dataSource.getRepository(ProductoEntity);
  await productoRepository.save(productos);
  console.log("Productos insertados");
}
