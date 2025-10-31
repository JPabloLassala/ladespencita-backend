import { Inject, Injectable } from "@nestjs/common";
import { Producto, ProductoUpdateCreate } from "./producto.entity";
import {
  fromProductoCreateToSchema,
  fromSchemaToProducto,
  ProductoSchema,
} from "./producto.schema";
import { IMAGE_MODEL, PRODUCTO_MODEL } from "src/constants";
import { ImageSchema } from "src/Image";

@Injectable()
export class ProductoRepository {
  constructor(
    @Inject(PRODUCTO_MODEL) private readonly productoModel: typeof ProductoSchema,
    @Inject(IMAGE_MODEL) private readonly imageModel: typeof ImageSchema,
  ) {}

  async getAll(): Promise<Producto[]> {
    const productoModels = await this.productoModel.findAll({
      include: [
        {
          model: this.imageModel,
          as: "image",
          required: false,
          attributes: ["id", "url", "productoId", "createdAt"],
        },
      ],
    });

    return productoModels.map(fromSchemaToProducto);
  }

  async getOne(id: string): Promise<Producto> {
    const productoModel = await this.productoModel.findByPk(id, {
      include: [
        {
          model: this.imageModel,
          as: "image",
          required: true,
          attributes: ["id", "url", "productoId", "createdAt"],
        },
      ],
    });

    return fromSchemaToProducto(productoModel);
  }

  async updateOne(partialProducto: Partial<Producto>): Promise<Producto> {
    const [, [producto]] = await this.productoModel.update(partialProducto, {
      where: { id: partialProducto.id },
      returning: true,
    });

    return fromSchemaToProducto(producto);
  }

  async createOne(partialProducto: ProductoUpdateCreate): Promise<Producto> {
    const productoCreateschema = fromProductoCreateToSchema(partialProducto);
    const result = await this.productoModel.create(productoCreateschema);

    return fromSchemaToProducto(result);
  }

  async getFromIds(ids: number[]): Promise<Producto[]> {
    const productos = await this.productoModel.findAll({ where: { id: ids } });

    return productos.map(fromSchemaToProducto);
  }

  async getStockPerId(): Promise<Map<number, number>> {
    const productos = await this.productoModel.findAll();

    return productos.reduce<Map<number, number>>(
      (acc, { id, totales }) => acc.set(id, totales),
      new Map(),
    );
  }

  async deleteOne(id: string): Promise<void> {
    const producto = await this.productoModel.findByPk(id);
    if (!producto) {
      return null;
    }

    await producto.destroy();
  }
}
