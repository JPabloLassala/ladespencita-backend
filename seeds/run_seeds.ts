import { exit } from "process";
import { seed_Alquileres } from "./seed_alquileres";
import { seed_Products } from "./seed_productos";

async function run_seeds() {
  await seed_Products();
  await seed_Alquileres();
  exit();
}

run_seeds();
