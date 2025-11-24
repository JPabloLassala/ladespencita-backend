import { Injectable } from "@nestjs/common";
import { ImageAdapter } from "./image.adapter";
import { ImageEntity } from "./image.entity";
@Injectable()
export class ImageService {
  constructor(private readonly imageAdapter: ImageAdapter) {}

  async deleteFromProductoId(productoId: number): Promise<void> {
    await this.imageAdapter.deleteManyFromProducto(productoId);
  }

  async deleteManyFromProducto(id: number) {
    await this.imageAdapter.deleteManyFromProducto(id);
  }

  async createOne(file: Express.Multer.File, productoId: number): Promise<ImageEntity> {
    return await this.imageAdapter.createOne(file, productoId);
  }
}
