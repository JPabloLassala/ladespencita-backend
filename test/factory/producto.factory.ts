import { faker } from "@faker-js/faker";
import { ProductoEntity } from "src/modules/producto";

export const createRandomProducto = (): ProductoEntity => ({
  id: faker.number.int(),
  nombre: faker.commerce.productName(),
  unidadesMetroLineal: faker.number.int({ min: 1, max: 1000 }),
  totales: faker.number.int({ min: 1, max: 1000 }),
  medidasAltura: faker.number.int({ min: 1, max: 300 }),
  medidasAncho: faker.number.int({ min: 1, max: 300 }),
  medidasProfundidad: faker.number.int({ min: 1, max: 300 }),
  medidasDiametro: faker.number.int({ min: 1, max: 300 }),
  costoProducto: faker.number.int({ min: 1, max: 10000 }),
  costoGrafica: faker.number.int({ min: 1, max: 10000 }),
  costoDiseno: faker.number.int({ min: 1, max: 10000 }),
  costoTotal: faker.number.int({ min: 1, max: 10000 }),
  valorUnitarioGarantia: faker.number.int({ min: 1, max: 10000 }),
  valorUnitarioAlquiler: faker.number.int({ min: 1, max: 10000 }),
  valorX1: faker.number.int({ min: 1, max: 10000 }),
  valorX3: faker.number.int({ min: 1, max: 10000 }),
  valorX6: faker.number.int({ min: 1, max: 10000 }),
  valorX12: faker.number.int({ min: 1, max: 10000 }),
  images: [],
  createdAt: new Date(),
  updatedAt: new Date(),
});
