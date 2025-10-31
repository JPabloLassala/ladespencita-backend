import { Injectable } from "@nestjs/common";
import { Dayjs } from "dayjs";
import { InjectRepository } from "@nestjs/typeorm";
import { AlquilerCreate, AlquilerEntity, AlquilerUpdate } from "./alquiler.entity";
import { And, LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm";

@Injectable()
export class AlquilerAdapter {
  constructor(
    @InjectRepository(AlquilerEntity)
    private readonly alquilerRepository: Repository<AlquilerEntity>,
  ) {}

  async getAlquileres(): Promise<AlquilerEntity[]> {
    return await this.alquilerRepository.find({
      relations: { productos: true },
    });
  }

  async getAlquileresBetweenDates(alquileres: {
    since: Dayjs;
    until: Dayjs;
  }): Promise<AlquilerEntity[]> {
    return await this.alquilerRepository.find({
      where: {
        fechaInicio: And(
          MoreThanOrEqual(alquileres.since.toDate()),
          LessThanOrEqual(alquileres.until.toDate()),
        ),
      },
    });
  }

  async getAlquiler(id: number): Promise<AlquilerEntity> {
    return await this.alquilerRepository.findOneBy({ id });
  }

  async updateOne(partialAlquiler: AlquilerUpdate): Promise<void> {
    await this.alquilerRepository.update({ id: partialAlquiler.id }, { ...partialAlquiler });
  }

  async createOne(partialAlquiler: AlquilerCreate): Promise<AlquilerEntity> {
    return await this.alquilerRepository.save(partialAlquiler);
  }

  async deleteOne(id: number): Promise<void> {
    await this.alquilerRepository.delete({ id });
  }
}
