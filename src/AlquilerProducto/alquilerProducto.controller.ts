import { Body, Controller, Get, HttpStatus, Param, Post, Query, Res } from "@nestjs/common";
import { AlquilerProductoRepository } from "./alquilerProducto.repository";
import { AlquilerProductoDto, fromDtoToAlquilerProducto } from "./alquilerProducto.dto";
import dayjs from "dayjs";
import { Response } from "express";
import { HigherThanStockError } from "./alquilerProducto.errors";

@Controller("alquilerProducto")
export class AlquilerProductoController {
  constructor(private readonly alquilerProductoRepository: AlquilerProductoRepository) {}

  @Post("/betweendates")
  async isAbleToRentBetweenDates(
    @Res() res: Response,
    @Query("since") since: string,
    @Query("until") until: string,
    @Body() alquilerProductos: Partial<AlquilerProductoDto>[],
  ) {
    const alquilerProductoEntities = alquilerProductos.map(fromDtoToAlquilerProducto);
    const dateSince = dayjs(since);
    const dateUntil = dayjs(until);
    try {
      await this.alquilerProductoRepository.isAbleToRentBetweenDates(
        dateSince,
        dateUntil,
        alquilerProductoEntities,
      );

      return res.status(HttpStatus.OK).send({
        isAble: true,
      });
    } catch (e) {
      if (e instanceof HigherThanStockError) {
        return res.status(HttpStatus.BAD_REQUEST).send(e.alquilerProductosStock);
      }

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
    }
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
