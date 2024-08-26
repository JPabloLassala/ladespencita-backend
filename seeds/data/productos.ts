import { faker } from "@faker-js/faker";
import { Producto } from "src/Producto";

export const productos: Producto[] = new Array(100).fill(0).map(() => ({
  nombre: faker.commerce.productName(),
  unidadesMetroLineal: faker.number.int({ min: 5, max: 15 }),
  disponibles: faker.number.int({ min: 0, max: 10 }),
  medidas: {
    altura: faker.number.int({ min: 8, max: 36 }),
  },
  stock: faker.number.int({ min: 10, max: 99 }),
  costo: {
    producto: faker.number.int({ min: 0, max: 7000 }),
    grafica: faker.number.int({ min: 450, max: 3500 }),
    diseno: faker.number.int({ min: 0, max: 3000 }),
    total: faker.number.int({ min: 0, max: 10000 }),
  },
  valor: {
    unitarioGarantia: faker.number.int({ min: 0, max: 10000 }),
    totalGarantia: faker.number.int({ min: 0, max: 10000 }),
    unitarioAlquiler: faker.number.int({ min: 0, max: 10000 }),
    x1: faker.number.int({ min: 0, max: 5000 }),
    x3: faker.number.int({ min: 0, max: 4500 }),
    x6: faker.number.int({ min: 0, max: 3500 }),
    x12: faker.number.int({ min: 0, max: 3000 }),
  },
}));
