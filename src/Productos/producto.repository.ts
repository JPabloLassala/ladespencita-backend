import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { KnexProvider } from 'src/Database';
import { Producto } from './producto.entity';
import { getProductoFromDTO } from './Product.record.dto';

const PAGE_AMOUNT = 10;

type PagedProductos = {
  productos: Producto[];
  page: number;
  total: number;
};

@Injectable()
export class ProductoRepository {
  private knexInstance: Knex;

  constructor(private readonly knexProvider: KnexProvider) {
    this.knexInstance = knexProvider.getInstance();
  }

  async getAll(): Promise<Producto[]> {
    const result = await this.knexInstance('productos').select('*');

    return result.map((pDto) => getProductoFromDTO(pDto));
  }

  async getOne(id: string): Promise<Producto> {
    const result = await this.knexInstance('productos')
      .select('*')
      .where('id', id)
      .limit(1)
      .first();

    return getProductoFromDTO(result);
  }

  async getPage(page: number): Promise<PagedProductos> {
    const result = await this.knexInstance('productos')
      .select('*')
      .limit(PAGE_AMOUNT)
      .offset((page - 1) * PAGE_AMOUNT);
    const count = await this.knexInstance('productos')
      .count<number>('1')
      .first();

    return {
      productos: result.map((pDto) => getProductoFromDTO(pDto)),
      page,
      total: count,
    };
  }
}
