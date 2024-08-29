import { Inject, Injectable } from "@nestjs/common";
import { Producto } from "./producto.entity";
import { fromProductoToSchema, fromSchemaToProducto, ProductoSchema } from "./producto.schema";
import { PRODUCTO_MODEL } from "src/constants";

@Injectable()
export class ProductoRepository {
  constructor(@Inject(PRODUCTO_MODEL) private readonly productoModel: typeof ProductoSchema) {}

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
}
