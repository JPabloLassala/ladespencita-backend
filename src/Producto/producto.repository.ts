import { Inject, Injectable } from "@nestjs/common";
import { Producto } from "./producto.entity";
import { fromProductoToSchema, fromSchemaToProducto, ProductoSchema } from "./producto.schema";
import { DB_CONNECTION, PRODUCTO_MODEL } from "src/constants";
import { Sequelize } from "sequelize";

@Injectable()
export class ProductoRepository {
  constructor(
    @Inject(PRODUCTO_MODEL) private readonly productoModel: typeof ProductoSchema,
    @Inject(DB_CONNECTION) private readonly sequelize: Sequelize,
  ) {}

  async getAll(): Promise<Producto[]> {
    const productoModels = await this.productoModel.findAll();

    return productoModels.map(fromSchemaToProducto);
  }

  async getOne(nombre: string): Promise<Producto> {
    const productoModel = await this.productoModel.findOne({ where: { nombre } });

    return fromSchemaToProducto(productoModel);
  }

  async updateOne(partialProducto: Partial<Producto>): Promise<Producto> {
    const [, [producto]] = await this.productoModel.update(partialProducto, {
      where: { id: partialProducto.id },
      returning: true,
    });

    return fromSchemaToProducto(producto);
  }

  async createOne(partialProducto: Partial<Producto>): Promise<Producto> {
    const partialProductoSchema = fromProductoToSchema(partialProducto);
    const result = await this.productoModel.create({ ...partialProductoSchema });

    return fromSchemaToProducto(result);
  }

  async getFromIds(ids: number[]): Promise<Producto[]> {
    const productos = await this.productoModel.findAll({ where: { id: ids } });

    return productos.map(fromSchemaToProducto);
  }

  async getStockPerId(): Promise<Map<number, number>> {
    const productos = await this.productoModel.findAll();

    return productos.reduce<Map<number, number>>(
      (acc, { id, stock }) => acc.set(id, stock),
      new Map(),
    );
  }
}
