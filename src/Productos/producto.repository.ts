import { Inject, Injectable } from "@nestjs/common";
import { Knex } from "knex";
import { Producto } from "./producto.entity";
import { ProductoRecordDTO, ProductoRequestDTO } from "./Product.record.dto";
import { KNEX_INSTANCE } from "src/constants/database";

const PAGE_AMOUNT = 10;

type PagedProductos = {
  productos: Producto[];
  page: number;
  total: number;
};

@Injectable()
export class ProductoRepository {
  constructor(@Inject(KNEX_INSTANCE) private readonly knex: Knex) {}

  async getAll(): Promise<Producto[]> {
    const result = await this.knex("productos").select("*");

    return result.map(
      (pDto) => ProductoRequestDTO.toProducto(pDto.id, pDto) as Producto,
    );
  }

  async getOne(id: string): Promise<Producto> {
    const result = await this.knex("productos")
      .select("*")
      .where("id", id)
      .limit(1)
      .first();

    return ProductoRequestDTO.toProducto(result.id, result) as Producto;
  }

  async getPage(page: number): Promise<PagedProductos> {
    const result = await this.knex("productos")
      .select("*")
      .limit(PAGE_AMOUNT)
      .offset((page - 1) * PAGE_AMOUNT);
    const count = await this.knex("productos").count<number>("1").first();

    return {
      productos: result.map((pDto) => ProductoRecordDTO.toProducto(pDto)),
      page,
      total: count,
    };
  }

  async updateOne(partialProducto: Partial<Producto>): Promise<Producto> {
    const result = await this.knex("productos")
      .where("id", partialProducto.id)
      .update(
        {
          ...partialProducto,
        },
        ["*"],
      );

    return ProductoRecordDTO.toProducto(result[0] as ProductoRecordDTO);
  }
}
