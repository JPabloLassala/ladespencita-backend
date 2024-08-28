import { faker } from "@faker-js/faker";
import mongoose from "mongoose";
import { AlquilerRecordDTO, AlquilerSchema } from "src/Alquiler/alquiler.schema";
import { AlquilerProductoDTO, AlquilerProductoSchema } from "src/AlquilerProducto";
import { ProductoRecordDTO, ProductoSchema } from "src/Producto";

export async function seed_Alquileres(): Promise<void> {
  const AlquilerModel = mongoose.model("Alquiler", AlquilerSchema);
  const AlquilerProductoModel = mongoose.model("AlquilerProducto", AlquilerProductoSchema);

  await mongoose.connect("mongodb://root:example@localhost:27017/nest?authSource=admin");
  await AlquilerProductoModel.deleteMany({});
  console.log("AlquilerProductos borrados");
  await AlquilerModel.deleteMany({});
  console.log("Alquileres borrados");
  await seed(AlquilerModel);
  console.log("Alquileres insertados");
}

async function seed(AlquilerModel: mongoose.Model<any>): Promise<void> {
  const alquilerModel = mongoose.model<AlquilerRecordDTO>("Alquiler", AlquilerSchema);
  const productoModel = mongoose.model<ProductoRecordDTO>("Producto", ProductoSchema);
  const alquilerProductoModel = mongoose.model<AlquilerProductoDTO>(
    "AlquilerProducto",
    AlquilerProductoSchema,
  );

  const alquileres: AlquilerRecordDTO[] = new Array(5).fill(undefined).map<AlquilerRecordDTO>(
    () =>
      new alquilerModel({
        _id: new mongoose.Types.ObjectId(),
        productora: faker.company.name(),
        proyecto: faker.company.name(),
        fechaPresupuesto: new Date(),
        fechaAlquiler: {
          inicio: faker.date.anytime(),
          fin: faker.date.anytime(),
        },
      }),
  );

  await AlquilerModel.insertMany(alquileres);

  const productos = await productoModel.find().exec();
  const getProductosAlquilerArray: () => Omit<AlquilerProductoDTO, "_id">[] = () => {
    const alquiler = faker.helpers.arrayElement(alquileres);
    const productoDtos = faker.helpers.arrayElements(productos, { min: 20, max: 30 });

    return productoDtos.map((productoDto) => {
      const valorx1 = parseInt(faker.string.numeric(3), 10);
      return {
        productoId: productoDto._id,
        alquilerId: alquiler._id,
        valor: {
          unitarioGarantia: parseInt(faker.string.numeric(4)),
          totalGarantia: parseInt(faker.string.numeric(4)),
          unitarioAlquiler: valorx1,
          x1: valorx1,
          x3: valorx1 * 3,
          x6: valorx1 * 6,
          x12: valorx1 * 12,
        },

        costo: {
          producto: productoDto.costo.producto,
          grafica: productoDto.costo.grafica,
          diseno: productoDto.costo.diseno,
          total: productoDto.costo.total,
        },
        unidadesAlquiladas: parseInt(faker.string.numeric(2), 10),
        unidadesCotizadas: parseInt(faker.string.numeric(2), 10),
        cantidad: faker.number.int({ min: 1, max: productoDto.stock - 9 }),
      };
    });
  };

  await alquilerProductoModel.collection.insertMany(getProductosAlquilerArray());
}
