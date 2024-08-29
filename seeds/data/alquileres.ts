import { faker } from "@faker-js/faker";

export const alquileres = new Array(5).fill(undefined).map(() => ({
  productora: faker.company.name(),
  proyecto: faker.company.name(),
  fechaPresupuesto: new Date(),
  fechaAlquiler: {
    inicio: faker.date.anytime(),
    fin: faker.date.anytime(),
  },
}));
