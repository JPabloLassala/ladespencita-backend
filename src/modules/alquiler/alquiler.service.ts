import { Injectable } from "@nestjs/common";
import { AlquilerAdapter } from "./alquiler.adapter";
import { AlquilerCreate, AlquilerUpdate } from "./alquiler.entity";
import { AlquilerProductoService } from "src/modules/alquiler-producto/alquiler-producto.service";

@Injectable()
export class AlquilerService {
  constructor(
    private readonly alquilerAdapter: AlquilerAdapter,
    private readonly alquilerProductoService: AlquilerProductoService,
  ) {}

  async getAlquileres() {
    return await this.alquilerAdapter.getAlquileres();
  }

  async getAlquiler(id: number) {
    return await this.alquilerAdapter.getAlquiler(id);
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
    await this.alquilerProductoService.deleteByAlquilerId(id);
    await this.alquilerAdapter.deleteOne(id);
  }
}
