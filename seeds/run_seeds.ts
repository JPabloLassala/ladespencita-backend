import { exit } from "process";
import { seed_Alquileres } from "./seed_alquileres";
import { seed_Products } from "./seed_productos";
import { Sequelize } from "sequelize-typescript";
import { AlquilerSchema } from "src/Alquiler";
import { AlquilerProductoSchema } from "src/AlquilerProducto";
import { ProductoSchema } from "src/Producto";
import "dotenv/config";

async function run_seeds() {
  const sequelize = new Sequelize({
    dialect: "postgres",
    database: "ladespensita",
    host: process.env.DB_HOST,
    port: 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    models: [AlquilerSchema, AlquilerProductoSchema, ProductoSchema],
  });

  await sequelize.sync({ force: true });
  await seed_Products();
  await seed_Alquileres();
  exit();
}

run_seeds();
