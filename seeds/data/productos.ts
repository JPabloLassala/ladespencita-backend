import { faker } from "@faker-js/faker";
import { IProductoCreateSchema } from "src/Producto";

export const productos: IProductoCreateSchema[] = new Array(100).fill(0).map(() => ({
  nombre: faker.commerce.productName(),
  unidadesMetroLineal: faker.number.int({ min: 5, max: 15 }),
  disponibles: faker.number.int({ min: 0, max: 10 }),
  medidasAltura: faker.number.int({ min: 1, max: 5 }),
  medidasAncho: faker.number.int({ min: 1, max: 5 }),
  medidasProfundidad: faker.number.int({ min: 1, max: 5 }),
  medidasDiametro: faker.number.int({ min: 1, max: 5 }),
  totales: faker.number.int({ min: 10, max: 99 }),
  costoProducto: faker.number.int({ min: 0, max: 7000 }),
  costoGrafica: faker.number.int({ min: 450, max: 3500 }),
  costoDiseno: faker.number.int({ min: 0, max: 3000 }),
  costoTotal: faker.number.int({ min: 0, max: 10000 }),
  valorUnitarioGarantia: faker.number.int({ min: 0, max: 10000 }),
  valorTotalGarantia: faker.number.int({ min: 0, max: 10000 }),
  valorUnitarioAlquiler: faker.number.int({ min: 0, max: 10000 }),
  valorX1: faker.number.int({ min: 0, max: 5000 }),
  valorX3: faker.number.int({ min: 0, max: 4500 }),
  valorX6: faker.number.int({ min: 0, max: 3500 }),
  valorX12: faker.number.int({ min: 0, max: 3000 }),
}));
