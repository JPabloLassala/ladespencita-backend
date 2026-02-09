import { Body, Controller, Get, Param, Post, Put, Query } from "@nestjs/common";
import { AlquilerProductoAdapter } from "./alquiler-producto.adapter";
import {
  AlquilerProductoCreateDTO,
  AlquilerProductoUpdateDTO,
  CheckRemainingDto,
} from "./alquiler-producto.dto";
import { AlquilerProductoService } from "./alquiler-producto.service";

@Controller("alquilerProducto")
export class AlquilerProductoController {
  constructor(
    private readonly alquilerProductoAdapter: AlquilerProductoAdapter,
    private readonly alquilerProductoService: AlquilerProductoService,
  ) {}

  @Get("/stock")
  async checkRemaining(@Query() query: CheckRemainingDto) {
    return await this.alquilerProductoService.checkRemaining(
      query.since,
      query.until,
      query.alquilerId,
    );
  }

  @Get("/:alquilerId")
  async getProductosFromAlquiler(@Param("alquilerId") alquilerId: number) {
    return await this.alquilerProductoAdapter.getProductosFromAlquiler(alquilerId);
  }

  @Post("/:alquilerId")
  async createAlquilerProducto(
    @Body() alquilerProducto: AlquilerProductoCreateDTO[],
    @Param("alquilerId") alquilerId: number,
  ) {
    return await this.alquilerProductoService.createMany(alquilerProducto, alquilerId);
  }

  @Put("/:alquilerId")
  async updatealquilerProductos(
    @Body() alquilerProductoDto: (AlquilerProductoUpdateDTO | AlquilerProductoCreateDTO)[],
    @Param("alquilerId") alquilerId: number,
  ) {
    return await this.alquilerProductoService.updateAlquilerProductos(
      alquilerProductoDto,
      alquilerId,
    );
  }
}
