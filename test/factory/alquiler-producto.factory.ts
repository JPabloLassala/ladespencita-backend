import { faker } from "@faker-js/faker";
import { AlquilerProductoEntity } from "src/modules/alquiler-producto/alquiler-producto.entity";

export const createRandomAlquilerProducto = (
  overrides?: Partial<AlquilerProductoEntity>,
): AlquilerProductoEntity =>
  ({
    id: faker.number.int(),
    productoId: faker.number.int(),
    alquilerId: faker.number.int(),
    costoProducto: faker.number.int({ min: 1, max: 10000 }),
    costoGrafica: faker.number.int({ min: 1, max: 10000 }),
    costoDiseno: faker.number.int({ min: 1, max: 10000 }),
    costoTotal: faker.number.int({ min: 1, max: 10000 }),
    cantidad: faker.number.int({ min: 1, max: 100 }),
    precioFinal: faker.number.int({ min: 1, max: 10000 }),
    valorUnitarioGarantia: faker.number.int({ min: 1, max: 10000 }),
    valorTotalGarantia: faker.number.int({ min: 1, max: 10000 }),
    valorUnitarioAlquiler: faker.number.int({ min: 1, max: 10000 }),
    valorX1: faker.number.int({ min: 1, max: 10000 }),
    valorX3: faker.number.int({ min: 1, max: 10000 }),
    valorX6: faker.number.int({ min: 1, max: 10000 }),
    valorX12: faker.number.int({ min: 1, max: 10000 }),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }) as AlquilerProductoEntity;
