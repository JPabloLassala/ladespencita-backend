import { Inject, Injectable } from "@nestjs/common";
import { ALQUILER_MODEL } from "src/constants/database";
import { AlquilerRecordDTO, fromDtoToAlquiler } from "./alquiler.schema";
import { Alquiler } from "./alquiler.entity";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";

@Injectable()
export class AlquilerRepository {
  constructor(
    @Inject(ALQUILER_MODEL) private readonly alquilerModel: SoftDeleteModel<AlquilerRecordDTO>,
  ) {}

  async getAlquileres(): Promise<Alquiler[]> {
    const alquilerDocs = await this.alquilerModel.find().exec();

    return alquilerDocs.map(fromDtoToAlquiler);
  }

  async getAlquileresBetweenDates(alquileres: {
    since: string;
    until: string;
  }): Promise<Alquiler[]> {
    const alquilerDocs = await this.alquilerModel
      .find({
        "fechaAlquiler.inicio": { $gte: alquileres.since },
        "fechaAlquiler.fin": { $lte: alquileres.until },
      })
      .exec();

    return alquilerDocs.map(fromDtoToAlquiler);
  }

  async getAlquiler(id: string): Promise<Alquiler> {
    const result = await this.alquilerModel.findOne({ _id: id }).exec();

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

  async deleteOne(id: string): Promise<void> {
    await this.alquilerModel.softDelete({ _id: id });
  }
}
