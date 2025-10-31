import { Inject, Injectable } from "@nestjs/common";
import { ALQUILER_MODEL } from "src/constants/database";
import { AlquilerRecordDTO } from "./alquiler.schema";
import { Alquiler } from "./alquiler.entity";
import { Model } from "mongoose";

@Injectable()
export class AlquilerRepository {
  constructor(@Inject(ALQUILER_MODEL) private readonly alquilerModel: Model<AlquilerRecordDTO>) {}

  async getAlquileres(): Promise<Alquiler[]> {
    const alquilerDocs = await this.alquilerModel.find().lean().exec();

    return alquilerDocs;
  }

  async getAlquiler(proyecto: string): Promise<Alquiler[]> {
    return await this.alquilerModel.find({ proyecto }).lean().exec();
  }

  async updateOne(partialAlquiler: Partial<Alquiler>): Promise<Alquiler> {
    const result = this.alquilerModel
      .findOneAndUpdate({ id: partialAlquiler.id }, partialAlquiler, { new: true })
      .lean()
      .exec();

    return result;
  }

  async createOne(partialAlquiler: Partial<Alquiler>): Promise<Alquiler> {
    const result = await this.alquilerModel.create(partialAlquiler);

    return result;
  }
}
