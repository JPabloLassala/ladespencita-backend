import { faker } from "@faker-js/faker";
import { AlquilerEntity } from "src/modules/alquiler/alquiler.entity";
import { ALQUILER_STATUS } from "src/modules/alquiler/alquiler.const";

export const createRandomAlquiler = (
  overrides?: Partial<AlquilerEntity>,
): AlquilerEntity => ({
  id: faker.number.int(),
  productora: faker.company.name(),
  proyecto: faker.commerce.productName(),
  status: ALQUILER_STATUS.PENDING,
  fechaPresupuesto: faker.date.recent(),
  fechaInicio: faker.date.recent(),
  fechaFin: faker.date.soon(),
  productos: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});
