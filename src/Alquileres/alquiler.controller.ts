import { Body, Controller, Get, Patch } from "@nestjs/common";
import { AlquilerRepository } from "./alquiler.repository";
import { Alquiler } from "./alquiler.entity";

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
}
