import { faker } from "@faker-js/faker";
import { ALQUILER_STATUS } from "src/alquiler";
import { AlquilerCreate } from "src/alquiler/alquiler.entity";

export const alquileres: AlquilerCreate[] = new Array(5).fill(undefined).map(() => ({
  productora: faker.company.name(),
  proyecto: faker.company.name(),
  fechaPresupuesto: new Date(),
  fechaInicio: faker.date.anytime(),
  fechaFin: faker.date.anytime(),
  status: ALQUILER_STATUS.PENDING,
  productos: [],
}));
