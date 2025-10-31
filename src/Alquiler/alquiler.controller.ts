import { Body, Controller, Delete, Get, Param, Patch, Post, Res } from "@nestjs/common";
import { Response } from "express";
import { AlquilerService } from "./alquiler.service";
import { AlquilerCreate, AlquilerEntity } from "./alquiler.entity";

@Controller("alquiler")
export class AlquilerController {
  constructor(private readonly alquilerService: AlquilerService) {}

  @Get()
  async getAll() {
    return await this.alquilerService.getAlquileres();
  }

  @Post()
  async createAlquiler(@Body() alquiler: AlquilerCreate) {
    return await this.alquilerService.createAlquiler(alquiler);
  }

  @Get(":id")
  async getOne(@Param("id") id: number) {
    return await this.alquilerService.getAlquiler(id);
  }

  @Patch()
  async updateAlquiler(@Body() alquiler: Partial<AlquilerEntity>) {
    return await this.alquilerService.updateAlquiler(alquiler);
  }

  @Delete(":id")
  async deleteAlquiler(@Param("id") id: number, @Res() res: Response) {
    await this.alquilerService.deleteAlquiler(id);

    return res.status(204).send();
  }
}
