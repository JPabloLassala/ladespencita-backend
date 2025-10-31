import { faker } from "@faker-js/faker";
import { AlquilerCreate } from "src/Alquiler/alquiler.entity";

export const alquileres: AlquilerCreate[] = new Array(5).fill(undefined).map(() => ({
  productora: faker.company.name(),
  proyecto: faker.company.name(),
  fechaPresupuesto: new Date(),
  fechaInicio: faker.date.anytime(),
  fechaFin: faker.date.anytime(),
  productos: [],
}));
