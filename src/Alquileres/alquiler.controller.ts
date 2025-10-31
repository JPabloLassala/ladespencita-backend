import { Body, Controller, Delete, Get, Param, Patch, Res } from "@nestjs/common";
import { AlquilerRepository } from "./alquiler.repository";
import { Alquiler } from "./alquiler.entity";
import { Response } from "express";

@Controller("alquileres")
export class AlquilerController {
  constructor(private readonly alquilerRepository: AlquilerRepository) {}

  @Get()
  async getAll() {
    return await this.alquilerRepository.getAlquileres();
  }

  @Patch()
  async updateAlquiler(@Body() alquiler: Partial<Alquiler>) {
    return await this.alquilerRepository.updateOne(alquiler);
  }

  @Delete(":id")
  async deleteAlquiler(@Param("id") id: string, @Res() res: Response) {
    await this.alquilerRepository.deleteOne(id);

    return res.status(204).send();
  }
}
