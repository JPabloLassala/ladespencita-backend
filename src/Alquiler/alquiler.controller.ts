import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from "@nestjs/common";
import { Response } from "express";
import { AlquilerService } from "./alquiler.service";
import { AlquilerCreate, AlquilerEntity, AlquilerUpdate } from "./alquiler.entity";
import { ProductoHigherThanAvailableError } from "./alquiler.error";

@Controller("alquiler")
export class AlquilerController {
  constructor(private readonly alquilerService: AlquilerService) {}

  @Get()
  async getAll() {
    return await this.alquilerService.getAlquileres();
  }

  @Post()
  async createAlquiler(@Body() alquiler: AlquilerCreate, @Res() res: Response) {
    try {
      const result = await this.alquilerService.createAlquiler(alquiler);

      return res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      if (error instanceof ProductoHigherThanAvailableError) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: "La cantidad de productos solicitados supera la disponibilidad.",
          productos: error.products,
        });
      }
      throw error;
    }
  }

  @Get(":id")
  async getOne(@Param("id") id: number) {
    return await this.alquilerService.getAlquiler(id);
  }

  @Put()
  async updateAlquiler(@Body() alquiler: AlquilerUpdate) {
    return await this.alquilerService.updateAlquiler(alquiler);
  }

  @Delete(":id")
  async deleteAlquiler(@Param("id") id: number, @Res() res: Response) {
    await this.alquilerService.deleteAlquiler(id);

    return res.status(204).send();
  }
}
