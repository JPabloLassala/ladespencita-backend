import { Inject, Injectable } from "@nestjs/common";
import { ALQUILER_MODEL } from "src/constants/database";
import { AlquilerRecordDTO, fromDtoToAlquiler } from "./alquiler.schema";
import { Alquiler } from "./alquiler.entity";
import { Model } from "mongoose";

@Injectable()
export class AlquilerRepository {
  constructor(@Inject(ALQUILER_MODEL) private readonly alquilerModel: Model<AlquilerRecordDTO>) {}

  async getAlquileres(): Promise<Alquiler[]> {
    const alquilerDocs = await this.alquilerModel.find().exec();

    return alquilerDocs.map(fromDtoToAlquiler);
  }

  async getAlquiler(proyecto: string): Promise<Alquiler> {
    const result = await this.alquilerModel.findOne({ proyecto }).exec();

    return fromDtoToAlquiler(result);
  }

  async updateOne(partialAlquiler: Partial<Alquiler>): Promise<Alquiler> {
    const result = await this.alquilerModel
      .findOneAndUpdate({ id: partialAlquiler.id }, partialAlquiler, { new: true })
      .exec();

    return fromDtoToAlquiler(result);
  }

  async createOne(partialAlquiler: Partial<Alquiler>): Promise<Alquiler> {
    const result = await this.alquilerModel.create(partialAlquiler);

    return fromDtoToAlquiler(result);
  }
}
