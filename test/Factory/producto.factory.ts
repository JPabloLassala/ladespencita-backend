import { faker } from "@faker-js/faker";
import { Producto } from "src/producto";

export const createRandomProducto = (): Producto => ({
  id: faker.number.int(),
  nombre: faker.commerce.productName(),
  unidadesMetroLineal: faker.number.int(),
  totales: faker.number.int(),
  disponibles: faker.number.int(),
  medidas: {
    altura: faker.number.int(),
    ancho: faker.number.int(),
    profundidad: faker.number.int(),
    diametro: faker.number.int(),
  },
  costo: {
    producto: faker.number.int(),
    grafica: faker.number.int(),
    diseno: faker.number.int(),
    total: faker.number.int(),
  },
  valor: {
    unitarioGarantia: faker.number.int(),
    unitarioAlquiler: faker.number.int(),
    x1: faker.number.int(),
    x3: faker.number.int(),
    x6: faker.number.int(),
    x12: faker.number.int(),
  },
});
