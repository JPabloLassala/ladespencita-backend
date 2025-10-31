import { Body, Controller, Get, HttpStatus, Param, Post, Query, Res } from "@nestjs/common";
import dayjs from "dayjs";
import { Response } from "express";
import { HigherThanStockError } from "./alquilerProducto.errors";
import { AlquilerProductoAdapter } from "./alquilerProducto.adapter";
import { AlquilerProductoEntity } from "./alquilerProducto.entity";
import { AlquilerProductoCreateDTO, AlquilerProductoUpdateDTO } from "./alquilerProducto.dto";
import { AlquilerProductoService } from "./alquilerProducto.service";

@Controller("alquilerProducto")
export class AlquilerProductoController {
  constructor(
    private readonly alquilerProductoAdapter: AlquilerProductoAdapter,
    private readonly alquilerProductoService: AlquilerProductoService,
  ) {}

  @Get("/stock")
  async getRemainingStock() {
    return await this.alquilerProductoService.getRemainingStock();
  }

  @Get("/:alquilerId")
  async getProductosFromAlquiler(@Param("alquilerId") alquilerId: number) {
    return await this.alquilerProductoAdapter.getProductosFromAlquiler(alquilerId);
  }

  @Post("/:alquilerId")
  async createAlquilerProducto(@Body() alquilerProducto: AlquilerProductoCreateDTO) {
    return await this.alquilerProductoAdapter.createOne(alquilerProducto);
  }

  @Post("/:alquilerId")
  async updatealquilerProducto(@Body() alquilerProductoDto: AlquilerProductoUpdateDTO) {
    return await this.alquilerProductoAdapter.updateAlquilerProducto(alquilerProductoDto);
  }
}
