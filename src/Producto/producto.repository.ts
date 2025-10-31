import { Inject, Injectable } from "@nestjs/common";
import { Producto } from "./producto.entity";
import { PRODUCTO_MODEL } from "src/constants/database";
import { fromDtoToProducto, ProductoRecordDTO } from "./producto.schema";
import { Model } from "mongoose";

@Injectable()
export class ProductoRepository {
  constructor(@Inject(PRODUCTO_MODEL) private readonly productoModel: Model<ProductoRecordDTO>) {}

  async getAll(): Promise<Producto[]> {
    const productoModels = await this.productoModel.find().exec();

    return productoModels.map(fromDtoToProducto);
  }

  async getOne(nombre: string): Promise<Producto> {
    const productoModel = await this.productoModel.findOne({ nombre }).exec();

    return fromDtoToProducto(productoModel);
  }

  async updateOne(partialProducto: Partial<Producto>): Promise<Producto> {
    const result = await this.productoModel
      .findOneAndUpdate({ id: partialProducto.id }, partialProducto, { new: true })
      .exec();

    return fromDtoToProducto(result);
  }

  async createOne(partialProducto: Partial<Producto>): Promise<Producto> {
    const result = await this.productoModel.create(partialProducto);

    return fromDtoToProducto(result);
  }

  async getProductosBetweenDates(alquileres: {
    since: string;
    until: string;
  }): Promise<Producto[]> {
    return [];
  }
}
