import { Controller, Get, Param } from "@nestjs/common";
import { AlquilerProductoRepository } from "./alquilerProducto.repository";

@Controller("alquilerProducto")
export class AlquilerProductoController {
  constructor(private readonly alquilerProductoRepository: AlquilerProductoRepository) {}

  @Get(":alquilerId")
  async getProductosFromAlquiler(@Param("alquilerId") alquilerId: string) {
    return await this.alquilerProductoRepository.getProductosFromAlquiler(alquilerId);
  }
}
