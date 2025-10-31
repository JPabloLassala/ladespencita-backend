import { faker } from "@faker-js/faker";
import { AlquilerSchema } from "src/Alquiler/alquiler.schema";
import { AlquilerProductoSchema } from "src/AlquilerProducto";
import { ProductoSchema } from "src/Producto";
import { alquileres } from "./data/alquileres";

export async function seed_Alquileres(): Promise<void> {
  await AlquilerProductoSchema.destroy({ where: {}, truncate: true });
  console.log("AlquilerProductos borrados");
  await AlquilerSchema.destroy({ where: {}, truncate: true });
  console.log("Alquileres borrados");

  await seed();
  console.log("Alquileres insertados");
}

async function seed(): Promise<void> {
  await AlquilerSchema.bulkCreate(alquileres);

  const alquilerModels = await AlquilerSchema.findAll();
  const productoModels = await ProductoSchema.findAll();

  const getProductosAlquilerArray = () => {
    const alquiler = faker.helpers.arrayElement(alquilerModels);
    const productosToParse = faker.helpers.arrayElements(productoModels, { min: 20, max: 30 });

    return productosToParse.map((productoToParse) => {
      const valorx1 = parseInt(faker.string.numeric(3), 10);
      return {
        productoId: productoToParse.id,
        alquilerId: alquiler.id,
        valorUnitarioGarantia: parseInt(faker.string.numeric(4)),
        valorTotalGarantia: parseInt(faker.string.numeric(4)),
        valorUnitarioAlquiler: valorx1,
        valorX1: valorx1,
        valorX3: valorx1 * 3,
        valorX6: valorx1 * 6,
        valorX12: valorx1 * 12,
        costoProducto: productoToParse.costoProducto,
        costoGrafica: productoToParse.costoGrafica,
        costoDiseno: productoToParse.costoDiseno,
        costoTotal: productoToParse.costoTotal,
        unidadesAlquiladas: parseInt(faker.string.numeric(2), 10),
        unidadesCotizadas: parseInt(faker.string.numeric(2), 10),
        cantidad: faker.number.int({ min: 1, max: productoToParse.stock - 9 }),
      };
    });
  };

  await AlquilerProductoSchema.bulkCreate(getProductosAlquilerArray());
}
