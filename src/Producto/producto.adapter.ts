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

  async getOne(id: number): Promise<ProductoEntity> {
    return await this.productoRepository.findOne({ where: { id }, relations: { image: true } });
  }

  async updateOne(partial: Partial<ProductoEntity>): Promise<ProductoEntity> {
    return await this.productoRepository.save({ id: partial.id, ...partial });
  }

  async createOne(partialProducto: ProductoEntityCreate): Promise<ProductoEntity> {
    return await this.productoRepository.save(partialProducto);
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
