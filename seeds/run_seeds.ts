import { exit } from "process";
import { seed_Alquileres } from "./seed_alquileres";
import { seed_Products } from "./seed_productos";
import { Sequelize } from "sequelize-typescript";
import { AlquilerSchema } from "src/Alquiler";
import { AlquilerProductoSchema } from "src/AlquilerProducto";
import { ProductoSchema } from "src/Producto";
import "dotenv/config";

async function run_seeds() {
  const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    models: [AlquilerSchema, AlquilerProductoSchema, ProductoSchema],
  });

  await sequelize.dropAllSchemas({});

  await sequelize.sync({ force: true });
  await seed_Products();
  await seed_Alquileres();
  exit();
}

run_seeds();
