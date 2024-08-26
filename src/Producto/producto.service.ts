import { Injectable } from "@nestjs/common";
import { ProductoRepository } from "./producto.repository";
import { AlquilerRepository } from "src/Alquiler";
import { AlquilerProductoRepository } from "src/AlquilerProducto";

@Injectable()
export class ProductoService {
  constructor(
    private readonly productoRepository: ProductoRepository,
    private readonly alquilerRepository: AlquilerRepository,
    private readonly alquilerProductoRepository: AlquilerProductoRepository,
  ) {}

  async getProductosBetweenDates(alquileres: { since: string; until: string }): Promise<void> {
    const alquileresBetweenDates =
      await this.alquilerRepository.getAlquileresBetweenDates(alquileres);
    console.log(alquileresBetweenDates.map((a) => a.id));
    const alquilerProductosFromAlquileres = await Promise.allSettled(
      alquileresBetweenDates.map((alquiler) =>
        this.alquilerProductoRepository.getProductosFromAlquiler(alquiler.id),
      ),
    );

    console.log(alquilerProductosFromAlquileres);
  }
}
