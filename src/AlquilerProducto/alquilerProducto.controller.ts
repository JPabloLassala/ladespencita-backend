import { Body, Controller, Get, HttpStatus, Param, Post, Query, Res } from "@nestjs/common";
import dayjs from "dayjs";
import { Response } from "express";
import { HigherThanStockError } from "./alquilerProducto.errors";
import { AlquilerProductoAdapter } from "./alquilerProducto.adapter";
import { AlquilerProductoEntity } from "./alquilerProducto.entity";
import { AlquilerProductoCreateDTO, AlquilerProductoUpdateDTO } from "./alquilerProducto.dto";

@Controller("alquilerProducto")
export class AlquilerProductoController {
  constructor(private readonly alquilerProductoRepository: AlquilerProductoAdapter) {}

  @Post("/betweendates")
  async isAbleToRentBetweenDates(
    @Res() res: Response,
    @Query("since") since: string,
    @Query("until") until: string,
    @Body() alquilerProductos: Partial<AlquilerProductoEntity>[],
  ) {
    const dateSince = dayjs(since);
    const dateUntil = dayjs(until);
    try {
      await this.alquilerProductoRepository.isAbleToRentBetweenDates(
        dateSince,
        dateUntil,
        alquilerProductos,
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
  async createAlquilerProducto(@Body() alquilerProducto: AlquilerProductoCreateDTO) {
    return await this.alquilerProductoRepository.createOne(alquilerProducto);
  }

  @Post("/:alquilerId")
  async updatealquilerProducto(@Body() alquilerProductoDto: AlquilerProductoUpdateDTO) {
    return await this.alquilerProductoRepository.updateAlquilerProducto(alquilerProductoDto);
  }
}
