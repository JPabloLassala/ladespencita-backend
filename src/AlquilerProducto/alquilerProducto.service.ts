import { Injectable } from "@nestjs/common";
import { AlquilerProductoAdapter } from "./alquilerProducto.adapter";

@Injectable()
export class AlquilerProductoService {
  constructor(private readonly alquilerProductoAdapter: AlquilerProductoAdapter) {}

  async getRemainingStock() {
    return await this.alquilerProductoAdapter.getRemainingStock();
  }
}
