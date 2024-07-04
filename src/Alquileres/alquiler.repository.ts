import { Inject, Injectable } from "@nestjs/common";
import { Knex } from "knex";
import { KNEX_INSTANCE } from "src/constants/database";
import { AlquilerProductoRecordDTO, AlquilerRecordDTO } from "./alquiler.dto";
import { Alquiler } from "./alquiler.entity";

@Injectable()
export class AlquilerRepository {
  constructor(@Inject(KNEX_INSTANCE) private readonly knex: Knex) {}

  async getAlquileres(): Promise<Alquiler[]> {
    const resultAlquiler = await this.knex()
      .select<AlquilerRecordDTO[]>("*")
      .as("a")
      .fromRaw("alquileres a");
    const resultProducto = await this.knex()
      .select<AlquilerProductoRecordDTO[]>("*")
      .as("ap")
      .fromRaw("alquileres_productos ap");

    const asda = resultAlquiler.map((r) =>
      AlquilerRecordDTO.toAlquilerWithoutProductos(r, resultProducto),
    );

    return asda;
  }

  async getAlquiler(id: number): Promise<Alquiler[]> {
    const resultAlquiler = await this.knex()
      .select<AlquilerRecordDTO[]>("*")
      .as("a")
      .fromRaw("alquileres a")
      .where("a.id", id);
    const resultProducto = await this.knex()
      .select<AlquilerProductoRecordDTO[]>("*")
      .as("ap")
      .fromRaw("alquileres_productos ap")
      .where("ap.alquiler_id", id);

    return resultAlquiler.map((r) =>
      AlquilerRecordDTO.toAlquilerWithoutProductos(r, resultProducto),
    );
  }

  // async getAlquileresWithProducts() {
  //   const query = this.knex("alquileres")
  //     .select<(AlquilerRecordDTO & ProductoRecordDTO)[]>("*")
  //     .leftJoin("productos", "alquileres.producto_id", "productos.id");

  //   console.log(query.toSQL());

  //   const result = await query;

  //   return fromDtosToAlquileres(result);
  // }

  async getAlquileresByProducto() {
    return "getAlquileresByProducto";
  }
}
