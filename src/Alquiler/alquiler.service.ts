import { Injectable } from "@nestjs/common";
import { AlquilerAdapter } from "./alquiler.adapter";
import { AlquilerCreate, AlquilerEntity } from "./alquiler.entity";
import { AlquilerProductoAdapter } from "src/AlquilerProducto";

@Injectable()
export class AlquilerService {
  constructor(
    private readonly alquilerAdapter: AlquilerAdapter,
    private readonly alquilerProductoAdapter: AlquilerProductoAdapter,
  ) {}

  async getAlquileres() {
    return await this.alquilerAdapter.getAlquileres();
  }

  async getAlquiler(id: number) {
    return await this.alquilerAdapter.getAlquiler(id);
  }

  async createAlquiler(alquiler: AlquilerCreate) {
    await this.alquilerProductoAdapter.checkAlquilerProductosAvailability(alquiler.productos);

    const newAlquiler = await this.alquilerAdapter.createOne(alquiler);
    const alquilerProductos = await this.alquilerProductoAdapter.createAlquilerProductos(
      newAlquiler.id,
      alquiler.productos,
    );

    newAlquiler.productos = alquilerProductos;

    return newAlquiler;
  }

  async getOne(id: number) {
    return await this.alquilerAdapter.getAlquiler(id);
  }

  async updateAlquiler(alquiler: Partial<AlquilerEntity>) {
    return await this.alquilerAdapter.updateOne(alquiler);
  }

  async deleteAlquiler(id: number) {
    await this.alquilerAdapter.deleteOne(id);
  }
}
