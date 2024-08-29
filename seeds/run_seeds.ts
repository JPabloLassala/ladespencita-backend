import { exit } from "process";
import { seed_Alquileres } from "./seed_alquileres";
import { seed_Products } from "./seed_productos";
import { ProductoSchema } from "src/Producto";
import { AlquilerSchema } from "src/Alquiler";
import { AlquilerProductoSchema } from "src/AlquilerProducto";
import { Sequelize } from "sequelize-typescript";

async function run_seeds() {
  const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "ladespen.sqlite",
    models: [ProductoSchema, AlquilerSchema, AlquilerProductoSchema],
  });

  await sequelize.sync({ force: true });
  await seed_Products();
  await seed_Alquileres();
  exit();
}

run_seeds();
