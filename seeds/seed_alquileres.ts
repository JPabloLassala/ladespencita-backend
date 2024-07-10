import { faker } from "@faker-js/faker";
import {
  AlquilerProductoDTO,
  AlquilerRecordDTO,
  AlquilerSchema,
} from "src/Alquileres/alquiler.schema";
import { productos } from "./data/productos";
import mongoose from "mongoose";

export async function seed_Alquileres(): Promise<void> {
  const AlquilerModel = mongoose.model("Alquiler", AlquilerSchema);

  await mongoose.connect("mongodb://root:example@localhost:27017/nest?authSource=admin");
  await AlquilerModel.deleteMany({});
  console.log("Alquileres borrados");
  await seed(AlquilerModel);
  console.log("Alquileres insertados");
}

async function seed(AlquilerModel: mongoose.Model<any>): Promise<void> {
  const productosAlquiler1 = new Array(10).fill(undefined).map((): AlquilerProductoDTO => {
    const productoDto = faker.helpers.arrayElement(productos);
    const valorx1 = parseInt(faker.string.numeric(3), 10);
    return {
      valor: {
        unitarioGarantia: parseInt(faker.string.numeric(4)),
        totalGarantia: parseInt(faker.string.numeric(4)),
        unitarioAlquiler: valorx1,
        x1: valorx1,
        x3: valorx1 * 3,
        x6: valorx1 * 6,
        x12: valorx1 * 12,
      },
      unidadesAlquiladas: parseInt(faker.string.numeric(2), 10),
      unidadesCotizadas: parseInt(faker.string.numeric(2), 10),
      cantidad: parseInt(faker.string.numeric(1), 10),
      producto: productoDto,
    };
  });
  const alquileres: AlquilerRecordDTO[] = new Array(5)
    .fill(undefined)
    .map<AlquilerRecordDTO>(() => ({
      id: faker.string.uuid(),
      productora: faker.company.name(),
      proyecto: faker.company.name(),
      productos: productosAlquiler1,
      fechaPresupuesto: new Date(),
      fechaAlquiler: {
        inicio: faker.date.anytime(),
        fin: faker.date.anytime(),
      },
    }));

  await AlquilerModel.insertMany(alquileres);
}
