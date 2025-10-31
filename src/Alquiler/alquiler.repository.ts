import { Inject, Injectable } from "@nestjs/common";
import { ALQUILER_MODEL } from "src/constants/database";
import { AlquilerSchema, fromSchemaToAlquiler } from "./alquiler.schema";
import { Alquiler } from "./alquiler.entity";
import { Dayjs } from "dayjs";

@Injectable()
export class AlquilerRepository {
  constructor(@Inject(ALQUILER_MODEL) private readonly alquilerModel: typeof AlquilerSchema) {}

  async getAlquileres(): Promise<Alquiler[]> {
    const alquilerDocs = await this.alquilerModel.findAll();

    return alquilerDocs.map(fromSchemaToAlquiler);
  }

  async getAlquileresBetweenDates(alquileres: { since: Dayjs; until: Dayjs }): Promise<Alquiler[]> {
    const alquilerDocs = await this.alquilerModel.findAll({
      where: {
        fechaInicio: {
          $gte: alquileres.since.toDate(),
          $lte: alquileres.until.toDate(),
        },
      },
    });

    return alquilerDocs.map(fromSchemaToAlquiler);
  }

  async getAlquiler(id: string): Promise<Alquiler> {
    const result = await this.alquilerModel.findByPk(id);

    return fromSchemaToAlquiler(result);
  }

  async updateOne(partialAlquiler: Partial<Alquiler>): Promise<Alquiler> {
    const [, [result]] = await this.alquilerModel.update(partialAlquiler, {
      where: { id: partialAlquiler.id },
      returning: true,
    });

    return fromSchemaToAlquiler(result);
  }

  async createOne(partialAlquiler: Partial<Alquiler>): Promise<Alquiler> {
    const result = await this.alquilerModel.create(partialAlquiler);

    return fromSchemaToAlquiler(result);
  }

  async deleteOne(id: string): Promise<void> {
    await this.alquilerModel.destroy({ where: { id: id } });
  }
}
