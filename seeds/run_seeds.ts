import { exit } from "process";
import { seed_Alquileres } from "./seed_alquileres";
import { seed_Products } from "./seed_productos";
import "dotenv/config";
import { DataSource } from "typeorm";

async function run_seeds() {
  const dataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    entities: [__dirname + "../src/**/*.entity{.ts,.js}"],
  });

  await dataSource.initialize();
  await dataSource.synchronize(true);
  await seed_Products(dataSource);
  await seed_Alquileres(dataSource);
  exit();
}

run_seeds();
