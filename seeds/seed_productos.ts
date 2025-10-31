import mongoose from "mongoose";
import { ProductoSchema } from "src/Productos";
import { productos } from "./data/productos";

export async function seed_Products() {
  await mongoose.connect("mongodb://root:example@localhost:27017/nest?authSource=admin");

  const ProductoModel = mongoose.model("Producto", ProductoSchema);
  await ProductoModel.deleteMany({});

  console.log("Productos borrados");

  await seed(ProductoModel);
  console.log("Productos insertados");
}

async function seed(ProductoModel: mongoose.Model<any>): Promise<void> {
  await ProductoModel.insertMany(productos);
}
