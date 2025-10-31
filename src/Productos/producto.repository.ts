import { Inject, Injectable } from "@nestjs/common";
import { Producto } from "./producto.entity";
import { PRODUCTO_MODEL } from "src/constants/database";
import { Model } from "mongoose";

@Injectable()
export class ProductoRepository {
  constructor(@Inject(PRODUCTO_MODEL) private readonly productoModel: Model<Producto>) {}

  async getAll(): Promise<Producto[]> {
    const productoModels = await this.productoModel.find().lean().exec();

    return productoModels.map((p) => {
      const id = p._id.toString();
      delete p._id;

      return { id, ...p };
    });
  }

  async getOne(nombre: string): Promise<Producto> {
    const productoModel = await this.productoModel.findOne({ nombre }).lean().exec();
    const id = productoModel._id.toString();
    delete productoModel._id;

    return { id, ...productoModel };
  }

  async updateOne(partialProducto: Partial<Producto>): Promise<Producto> {
    const result = await this.productoModel
      .findOneAndUpdate({ id: partialProducto.id }, partialProducto, { new: true })
      .lean()
      .exec();

    const id = result._id.toString();
    delete result._id;

    return { id, ...result };
  }

  async createOne(partialProducto: Partial<Producto>): Promise<Producto> {
    const result = await this.productoModel.create(partialProducto);
    const id = result._id.toString();

    return { id, ...result };
  }
}
