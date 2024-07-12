import { faker } from "@faker-js/faker";
import mongoose from "mongoose";
import {
  AlquilerProductoDTO,
  AlquilerRecordDTO,
  AlquilerSchema,
} from "src/Alquileres/alquiler.schema";
import { ProductoRecordDTO, ProductoSchema } from "src/Productos";

export async function seed_Alquileres(): Promise<void> {
  const AlquilerModel = mongoose.model("Alquiler", AlquilerSchema);

  await mongoose.connect("mongodb://root:example@localhost:27017/nest?authSource=admin");
  await AlquilerModel.deleteMany({});
  console.log("Alquileres borrados");
  await seed(AlquilerModel);
  console.log("Alquileres insertados");
}

async function seed(AlquilerModel: mongoose.Model<any>): Promise<void> {
  const alquilerModel = mongoose.model<AlquilerRecordDTO>("Alquiler", AlquilerSchema);
  const productoModel = mongoose.model<ProductoRecordDTO>("Producto", ProductoSchema);

  const productos = await productoModel.find().exec();

  const getProductosAlquilerArray: () => AlquilerProductoDTO[] = () => {
    const productoDtos = faker.helpers.arrayElements(productos, { min: 3, max: 30 });
    console.log(productoDtos.map((p) => `${p.id} - ${p.nombre}`));
    return productoDtos.map((productoDto) => {
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
        cantidad: faker.number.int({ min: 1, max: productoDto.stock - 9 }),
        producto: faker.helpers.arrayElement(productos),
      };
    });
  };
  const alquileres: AlquilerRecordDTO[] = new Array(5).fill(undefined).map<AlquilerRecordDTO>(
    () =>
      new alquilerModel({
        id: faker.string.uuid(),
        productora: faker.company.name(),
        proyecto: faker.company.name(),
        productos: getProductosAlquilerArray(),
        fechaPresupuesto: new Date(),
        fechaAlquiler: {
          inicio: faker.date.anytime(),
          fin: faker.date.anytime(),
        },
      }),
  );

  await AlquilerModel.insertMany(alquileres);
}
