import { Controller, Get, Param } from "@nestjs/common";
import { AlquilerRepository } from "./alquiler.repository";

@Controller("alquileres")
export class AlquilerController {
  constructor(private readonly alquilerRepository: AlquilerRepository) {}

  @Get()
  async getAlquileresWithoutProducts() {
    return await this.alquilerRepository.getAlquileres();
  }

  @Get(":id")
  async getOne(@Param("id") id: number) {
    return await this.alquilerRepository.getAlquiler(id);
  }

  @Get("/producto/:id")
  async getAlquileresByProducto() {
    return "getAlquileresByProducto";
  }
}
