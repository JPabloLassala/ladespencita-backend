import { Injectable } from "@nestjs/common";
import { AlquilerProductoAdapter } from "./alquilerProducto.adapter";
import { AlquilerProductoCreate } from "./alquilerProducto.entity";

@Injectable()
export class AlquilerProductoService {
  constructor(private readonly alquilerProductoAdapter: AlquilerProductoAdapter) {}

  async checkAlquilerProductsAvailability(ap: AlquilerProductoCreate[]) {
    return await this.alquilerProductoAdapter.checkAlquilerProductosAvailability(ap);
  }

  async createMany(alquilerProductos: AlquilerProductoCreate[], alquilerId: number) {
    return await this.alquilerProductoAdapter.createBulk(alquilerProductos, alquilerId);
  }
}
