import { Inject, Injectable } from "@nestjs/common";
import { Producto } from "./producto.entity";
import { PRODUCTO_MODEL } from "src/constants/database";
import { Model } from "mongoose";

@Injectable()
export class ProductoRepository {
  constructor(@Inject(PRODUCTO_MODEL) private readonly productoModel: Model<Producto>) {}

  async getAll(): Promise<Producto[]> {
    const productoModels = await this.productoModel.find().lean().exec();

    return productoModels;
  }

  async getOne(nombre: string): Promise<Producto> {
    const productoModel = await this.productoModel.findOne({ nombre }).lean().exec();

    return productoModel;
  }

  async updateOne(partialProducto: Partial<Producto>): Promise<Producto> {
    const result = this.productoModel
      .findOneAndUpdate({ id: partialProducto.id }, partialProducto, { new: true })
      .lean()
      .exec();

    return result;
  }

  async createOne(partialProducto: Partial<Producto>): Promise<Producto> {
    const result = await this.productoModel.create(partialProducto);

    return result;
  }
}
