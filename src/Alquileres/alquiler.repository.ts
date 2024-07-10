import { Inject, Injectable } from "@nestjs/common";
import { ALQUILER_MODEL } from "src/constants/database";
import { AlquilerProductoDTO, AlquilerRecordDTO } from "./alquiler.schema";
import { Alquiler, AlquilerProducto } from "./alquiler.entity";
import { Model } from "mongoose";

@Injectable()
export class AlquilerRepository {
  constructor(@Inject(ALQUILER_MODEL) private readonly alquilerModel: Model<AlquilerRecordDTO>) {}

  async getAlquileres(): Promise<Alquiler[]> {
    const alquilerDocs = await this.alquilerModel.find().lean().exec();

    return alquilerDocs.map((a) => {
      const id = a._id.toString();
      a._id = undefined;
      const productos: AlquilerProducto[] = a.productos.map((ap: AlquilerProductoDTO) => {
        const id = ap.producto._id.toString();
        ap.producto._id = undefined;
        return { ...ap, producto: { id, ...ap.producto } };
      });

      return { id, ...a, productos };
    });
  }

  async getAlquiler(proyecto: string): Promise<Alquiler[]> {
    const result = await this.alquilerModel.find({ proyecto }).lean().exec();

    return result.map((a) => {
      const id = a._id.toString();
      a._id = undefined;

      const productos: AlquilerProducto[] = a.productos.map((ap: AlquilerProductoDTO) => {
        const id = ap.producto._id.toString();
        ap.producto._id = undefined;
        return { ...ap, producto: { id, ...ap.producto } };
      });

      return { ...a, ...productos };
    });
  }

  async updateOne(partialAlquiler: Partial<Alquiler>): Promise<Alquiler> {
    const result = await this.alquilerModel
      .findOneAndUpdate({ id: partialAlquiler.id }, partialAlquiler, { new: true })
      .lean()
      .exec();

    const id = result._id.toString();
    result._id = undefined;

    return { id, ...result };
  }

  async createOne(partialAlquiler: Partial<Alquiler>): Promise<Alquiler> {
    const result = await this.alquilerModel.create(partialAlquiler);

    result.id = result._id.toString();
    result._id = undefined;

    return result;
  }
}
