import { Injectable } from "@nestjs/common";
import { AlquilerProductoAdapter } from "./alquilerProducto.adapter";
import {
  AlquilerProductoCreate,
  AlquilerProductoEntity,
  AlquilerProductoUpdate,
} from "./alquilerProducto.entity";

@Injectable()
export class AlquilerProductoService {
  constructor(private readonly alquilerProductoAdapter: AlquilerProductoAdapter) {}

  async checkAlquilerProductsAvailability(ap: AlquilerProductoCreate[]) {
    return await this.alquilerProductoAdapter.checkAlquilerProductosAvailability(ap);
  }

  async createMany(alquilerProductos: AlquilerProductoCreate[], alquilerId: number) {
    return await this.alquilerProductoAdapter.createMany(alquilerProductos, alquilerId);
  }

  async updateAlquilerProductos(
    alquilerProductos: (AlquilerProductoUpdate | AlquilerProductoCreate)[],
    alquilerId: number,
  ): Promise<AlquilerProductoEntity[]> {
    const apsToCreate = alquilerProductos.filter(
      ap => !ap.hasOwnProperty("id"),
    ) as AlquilerProductoCreate[];
    const apsToUpdate = alquilerProductos.filter(ap =>
      ap.hasOwnProperty("id"),
    ) as AlquilerProductoUpdate[];
    const apsToDelete = alquilerProductos
      .filter(ap => ap.cantidad === 0 && ap.hasOwnProperty("id"))
      .map((ap: AlquilerProductoUpdate) => ap.id);

    const [created, updated] = await Promise.all([
      this.alquilerProductoAdapter.createMany(apsToCreate, alquilerId),
      this.alquilerProductoAdapter.updateMany(apsToUpdate),
      this.alquilerProductoAdapter.deleteMany(apsToDelete),
    ]);

    return [...created, ...updated];
  }
}
