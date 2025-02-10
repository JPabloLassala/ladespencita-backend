import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { AlquilerProductoRepository } from "./alquilerProducto.repository";
import { AlquilerProductoDto, fromDtoToAlquilerProducto } from "./alquilerProducto.dto";
import dayjs from "dayjs";

@Controller("alquilerProducto")
export class AlquilerProductoController {
  constructor(private readonly alquilerProductoRepository: AlquilerProductoRepository) {}

  @Get("/betweenDates")
  async getAlquileresBetweenDates(
    @Query() dates: { since: string; until: string },
    @Body() alquileres: Partial<AlquilerProductoDto>[],
  ) {
    return await this.alquilerProductoRepository.isAbleToRentBetweenDates(
      dayjs(dates.since).utc(true),
      dayjs(dates.until).utc(true),
      alquileres,
    );
  }

  @Get("/:alquilerId")
  async getProductosFromAlquiler(@Param("alquilerId") alquilerId: number) {
    return await this.alquilerProductoRepository.getProductosFromAlquiler(alquilerId);
  }

  @Post("/:alquilerId")
  async createAlquilerProductos(
    @Param("alquilerId") alquilerId: number,
    @Body() alquilerProductos: Partial<AlquilerProductoDto>[],
  ) {
    const alquilerProductoEntities = alquilerProductos.map(fromDtoToAlquilerProducto);
    return await this.alquilerProductoRepository.createAlquilerProductos(
      alquilerId,
      alquilerProductoEntities,
    );
  }

  @Post("/:alquilerId")
  async updatealquilerProductos(@Body() alquilerProductos: Partial<AlquilerProductoDto>[]) {
    const alquilerProductoEntities = alquilerProductos.map(fromDtoToAlquilerProducto);
    return await this.alquilerProductoRepository.updateAlquilerProductos(alquilerProductoEntities);
  }
}
