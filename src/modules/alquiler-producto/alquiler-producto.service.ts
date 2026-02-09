import { Injectable } from "@nestjs/common";
import { AlquilerProductoAdapter } from "./alquiler-producto.adapter";
import {
  AlquilerProductoCreate,
  AlquilerProductoEntity,
  AlquilerProductoUpdate,
} from "./alquiler-producto.entity";

@Injectable()
export class AlquilerProductoService {
  constructor(private readonly alquilerProductoAdapter: AlquilerProductoAdapter) {}

  async checkRemaining(since: Date, until: Date, alquilerId: number) {
    return await this.alquilerProductoAdapter.checkRemaining(since, until, alquilerId);
  }

  async createMany(alquilerProductos: AlquilerProductoCreate[], alquilerId: number) {
    const apsToCreate = alquilerProductos.filter(ap => ap.cantidad > 0);
    return await this.alquilerProductoAdapter.createMany(apsToCreate, alquilerId);
  }

  async updateAlquilerProductos(
    alquilerProductos: (AlquilerProductoUpdate | AlquilerProductoCreate)[],
    alquilerId: number,
  ): Promise<AlquilerProductoEntity[]> {
    const apsToCreate = alquilerProductos.filter(
      ap => !ap.hasOwnProperty("id") && ap.cantidad > 0,
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

  async deleteByAlquilerId(alquilerId: number) {
    await this.alquilerProductoAdapter.deleteByAlquilerId(alquilerId);
  }
}
