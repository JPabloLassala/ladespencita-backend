import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { AlquilerProductoRepository } from "./alquilerProducto.repository";
import { AlquilerProductoDto, fromDtoToAlquilerProducto } from "./alquilerProducto.dto";

@Controller("alquilerProducto")
export class AlquilerProductoController {
  constructor(private readonly alquilerProductoRepository: AlquilerProductoRepository) {}

  @Get("/:alquilerId")
  async getProductosFromAlquiler(@Param("alquilerId") alquilerId: number) {
    return await this.alquilerProductoRepository.getProductosFromAlquiler(alquilerId);
  }

  @Post("/:alquilerId")
  async updatealquilerProductos(@Body() alquilerProductos: Partial<AlquilerProductoDto>[]) {
    const alquilerProductoEntities = alquilerProductos.map(fromDtoToAlquilerProducto);
    return await this.alquilerProductoRepository.updateAlquilerProductos(alquilerProductoEntities);
  }
}
