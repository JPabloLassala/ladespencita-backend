import { Injectable } from "@nestjs/common";

@Injectable()
export class AlquilerRepository {
  constructor(private readonly) {}

  async getAll() {
    return "getAll";
  }

  async getOne() {
    return "getOne";
  }

  async getAlquileresByProducto() {
    return "getAlquileresByProducto";
  }
}
