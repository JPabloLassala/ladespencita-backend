import { Inject, Injectable } from "@nestjs/common";
import { Producto } from "./producto.entity";
import { ProductoRecordDTO, ProductoRequestDTO } from "./producto.schema";
import { PRODUCTO_MODEL } from "src/constants/database";
import { Model } from "mongoose";

@Injectable()
export class ProductoRepository {
  constructor(@Inject(PRODUCTO_MODEL) private readonly productoModel: Model<ProductoRecordDTO>) {}

  async getAll(): Promise<Producto[]> {
    const productoModels = await this.productoModel.find().lean().exec();

    return productoModels.map((p) => ProductoRequestDTO.toProducto(p) as Producto);
  }

  async getOne(id: string): Promise<Producto> {
    const productoModel = await this.productoModel.findOne({ id }).lean().exec();

    return ProductoRequestDTO.toProducto(productoModel) as Producto;
  }

  async updateOne(partialProducto: Partial<Producto>): Promise<Producto> {
    const result = this.productoModel
      .findOneAndUpdate({ id: partialProducto.id }, partialProducto, { new: true })
      .lean()
      .exec();

    return ProductoRecordDTO.toProducto(result[0] as ProductoRecordDTO);
  }

  async createOne(partialProducto: Partial<Producto>): Promise<Producto> {
    const result = await this.productoModel.create(ProductoRecordDTO.fromProducto(partialProducto));

    return ProductoRecordDTO.toProducto(result[0] as ProductoRecordDTO);
  }
}
