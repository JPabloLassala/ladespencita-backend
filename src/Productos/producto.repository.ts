import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { Producto } from './producto.entity';
import { getProductoFromDTO } from './Product.record.dto';
import { KNEX_INSTANCE } from 'src/constants/database';

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
    const result = await this.knex('productos').select('*');

    return result.map((pDto) => getProductoFromDTO(pDto));
  }

  async getOne(id: string): Promise<Producto> {
    const result = await this.knex('productos')
      .select('*')
      .where('id', id)
      .limit(1)
      .first();

    return getProductoFromDTO(result);
  }

  async getPage(page: number): Promise<PagedProductos> {
    const result = await this.knex('productos')
      .select('*')
      .limit(PAGE_AMOUNT)
      .offset((page - 1) * PAGE_AMOUNT);
    const count = await this.knex('productos').count<number>('1').first();

    return {
      productos: result.map((pDto) => getProductoFromDTO(pDto)),
      page,
      total: count,
    };
  }
}
