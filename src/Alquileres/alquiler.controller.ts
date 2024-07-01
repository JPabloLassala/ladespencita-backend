import { Controller, Get } from "@nestjs/common";

@Controller("alquileres")
export class AlquilerController {
  constructor() {}

  @Get()
  async getAll() {
    return "getAll";
  }

  @Get(":id")
  async getOne() {
    return "getOne";
  }

  @Get("/producto/:id")
  async getAlquileresByProducto() {
    return "getAlquileresByProducto";
  }
}
