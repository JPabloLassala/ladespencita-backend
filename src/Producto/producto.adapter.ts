import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { ProductoEntity, ProductoEntityCreate } from "./producto.entity";

@Injectable()
export class ProductoAdapter {
  constructor(
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
  ) {}

  async getAll(): Promise<ProductoEntity[]> {
    const productos = await this.productoRepository.find({
      relations: {
        image: true,
      },
    });

    return productos;
  }

  async getOne(id: string): Promise<ProductoEntity> {
    return await this.productoRepository.findOne({
      where: { id: +id },
      relations: {
        image: true,
      },
    });
  }

  async updateOne(partialProducto: Partial<ProductoEntity>): Promise<ProductoEntity> {
    await this.productoRepository.update(
      { id: partialProducto.id },
      {
        ...partialProducto,
      },
    );

    return await this.productoRepository.findOne({
      where: { id: partialProducto.id },
      relations: {
        image: true,
      },
    });
  }

  async createOne(partialProducto: ProductoEntityCreate): Promise<ProductoEntity> {
    return await this.productoRepository.save(partialProducto);
  }

  async getFromIds(ids: number[]): Promise<ProductoEntity[]> {
    return await this.productoRepository.find({ where: { id: In(ids) } });
  }

  async getStockPerId(): Promise<Map<number, number>> {
    const productos = await this.productoRepository.find();

    return productos.reduce<Map<number, number>>(
      (acc, { id, totales }) => acc.set(id, totales),
      new Map(),
    );
  }

  async deleteOne(id: number): Promise<void> {
    const producto = await this.productoRepository.findOne({ where: { id: +id } });
    if (!producto) {
      return null;
    }

    await this.productoRepository.remove(producto);
  }
}
