import { faker } from "@faker-js/faker";
import { alquileres } from "./data/alquileres";
import { AlquilerEntity } from "src/alquiler/alquiler.entity";
import { AlquilerProductoCreate } from "src/alquiler-producto";
import { ProductoEntity } from "src/producto";
import { DataSource } from "typeorm";

export async function seed_Alquileres(dataSource): Promise<void> {
  await seed(dataSource);
  console.log("Alquileres insertados");
}

async function seed(dataSource: DataSource): Promise<void> {
  const alquilerRepository = dataSource.getRepository(AlquilerEntity);
  const productoRepository = dataSource.getRepository(ProductoEntity);
  const alquilerProductoRepository = dataSource.getRepository("AlquilerProducto");
  await alquilerRepository.save(alquileres);

  const alquilerModels = await alquilerRepository.find();
  const productoModels = await productoRepository.find();

  const getProductosAlquilerArray = (): AlquilerProductoCreate[] => {
    const alquiler = faker.helpers.arrayElement(alquilerModels);
    const productosToParse = faker.helpers.arrayElements(productoModels, { min: 20, max: 30 });

    return productosToParse.map(productoToParse => {
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
        precioFinal: valorx1,
        costoProducto: productoToParse.costoProducto,
        costoGrafica: productoToParse.costoGrafica,
        costoDiseno: productoToParse.costoDiseno,
        costoTotal: productoToParse.costoTotal,
        unidadesAlquiladas: parseInt(faker.string.numeric(2), 10),
        unidadesCotizadas: parseInt(faker.string.numeric(2), 10),
        cantidad: faker.number.int({ min: 1, max: productoToParse.totales - 9 }),
      };
    });
  };

  await alquilerProductoRepository.save(getProductosAlquilerArray());
}
