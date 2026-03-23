import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { AlquilerAdapter } from "./alquiler.adapter";
import { AlquilerCreate, AlquilerUpdate } from "./alquiler.entity";
import { AlquilerEntity } from "./alquiler.entity";
import { AlquilerProductoService } from "src/modules/alquiler-producto/alquiler-producto.service";
import { AlquilerProductoEntity } from "src/modules/alquiler-producto/alquiler-producto.entity";

@Injectable()
export class AlquilerService {
  constructor(
    private readonly alquilerAdapter: AlquilerAdapter,
    private readonly alquilerProductoService: AlquilerProductoService,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async getAlquileres() {
    return await this.alquilerAdapter.getAlquileres();
  }

  async getAlquiler(id: number) {
    const alquiler = await this.alquilerAdapter.getAlquiler(id);
    if (!alquiler) throw new NotFoundException(`Alquiler ${id} not found`);
    return alquiler;
  }

  async createAlquiler(alquiler: AlquilerCreate) {
    return await this.alquilerAdapter.createOne(alquiler);
  }

  async getOne(id: number) {
    return await this.alquilerAdapter.getAlquiler(id);
  }

  async updateAlquiler(alquiler: AlquilerUpdate) {
    return await this.alquilerAdapter.updateOne(alquiler);
  }

  async deleteAlquiler(id: number) {
    await this.dataSource.transaction(async manager => {
      await manager.delete(AlquilerProductoEntity, { alquilerId: id });
      await manager.delete(AlquilerEntity, { id });
    });
  }
}
