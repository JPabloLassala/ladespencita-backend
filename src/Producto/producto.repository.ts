import { Inject, Injectable } from "@nestjs/common";
import { Producto, ProductoCreate } from "./producto.entity";
import { fromProductoToSchema, fromSchemaToProducto, ProductoSchema } from "./producto.schema";
import { DB_CONNECTION, IMAGE_MODEL, PRODUCTO_MODEL } from "src/constants";
import { Sequelize } from "sequelize";
import { ImageRepository, ImageSchema } from "src/Image";

@Injectable()
export class ProductoRepository {
  constructor(
    @Inject(PRODUCTO_MODEL) private readonly productoModel: typeof ProductoSchema,
    @Inject(IMAGE_MODEL) private readonly imageModel: typeof ImageSchema,
    @Inject(DB_CONNECTION) private readonly sequelize: Sequelize,
    private readonly imageRepository: ImageRepository,
  ) {}

  async getAll(): Promise<Producto[]> {
    const productoModels = await this.productoModel.findAll({
      include: [
        {
          model: this.imageModel,
          as: "images",
          required: false,
          attributes: ["id", "url", "productoId", "createdAt"],
        },
      ],
    });

    return productoModels.map(fromSchemaToProducto);
  }

  async getOne(id: string): Promise<Producto> {
    const productoModel = await this.productoModel.findByPk(id);

    return fromSchemaToProducto(productoModel);
  }

  async updateOne(partialProducto: Partial<Producto>): Promise<Producto> {
    const [, [producto]] = await this.productoModel.update(partialProducto, {
      where: { id: partialProducto.id },
      returning: true,
    });

    return fromSchemaToProducto(producto);
  }

  async createOne(partialProducto: ProductoCreate): Promise<Producto> {
    const createProductoSchema = fromProductoToSchema(partialProducto);
    // const imageSchemas = this.imageRe;
    const result = await this.productoModel.create({ ...createProductoSchema });

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
}
