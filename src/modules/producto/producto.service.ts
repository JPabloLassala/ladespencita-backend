import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { Dayjs } from "dayjs";
import { AlquilerAdapter } from "src/modules/alquiler";
import { ProductoAdapter } from "./producto.adapter";
import { ProductoEntity, ProductoEntityCreate, ProductoEntityUpdate } from "./producto.entity";
import { AlquilerProductoAdapter } from "src/modules/alquiler-producto";
import { ImageService } from "src/modules/image";

@Injectable()
export class ProductoService {
  constructor(
    @Inject(forwardRef(() => AlquilerProductoAdapter))
    private readonly alquilerProductoAdapter: AlquilerProductoAdapter,
    @Inject(forwardRef(() => AlquilerAdapter))
    private readonly alquilerAdapter: AlquilerAdapter,
    private readonly productoAdapter: ProductoAdapter,
    private readonly imageService: ImageService,
  ) {}

  async getProductosBetweenDates({
    since,
    until,
  }: {
    since: Dayjs;
    until: Dayjs;
  }): Promise<ProductoEntity[]> {
    const alquileres = await this.alquilerAdapter.getAlquileresBetweenDates({
      since,
      until,
    });
    Logger.log(alquileres);
    const alquilerProductos = await this.alquilerProductoAdapter.getProductosFromAlquilerIds(
      alquileres.map(a => a.id),
    );
    const productos = await this.productoAdapter.getAll();
    const productosInStock = productos.map(p => {
      const alquilerProducto = alquilerProductos.filter(ap => ap.productoId === p.id);
      const amount = alquilerProducto.reduce((acc, ap) => acc + ap.cantidad, 0);

      return { ...p, cantidad: p.totales - amount };
    });

    return productosInStock;
  }

  async createOne(
    partialProducto: ProductoEntityCreate,
    file: Express.Multer.File,
  ): Promise<ProductoEntity> {
    const result = await this.productoAdapter.createOne(partialProducto);
    const images = await this.imageService.create(file, result.id);

    return { ...result, images };
  }

  async updateOne(
    partialProducto: ProductoEntityUpdate,
    file: Express.Multer.File,
  ): Promise<ProductoEntity> {
    const updated = await this.productoAdapter.updateOne(partialProducto);
    if (file) {
      // Get current images BEFORE uploading new ones so we know which IDs to remove
      const current = await this.productoAdapter.getOne(partialProducto.id);
      const oldImageIds = (current?.images ?? []).map(img => img.id);
      // Upload new images first — if this fails, old images are untouched
      const newImages = await this.imageService.create(file, partialProducto.id);
      updated.images = newImages;
      // Delete only the old images by specific ID, after the upload succeeds
      if (oldImageIds.length > 0) {
        await this.imageService.deleteManyByIds(oldImageIds);
      }
    }

    return updated;
  }

  async deleteOne(id: number): Promise<void> {
    const alquileres = await this.alquilerAdapter.getAlquileresWithProductoId(id);

    if (alquileres.length > 0) {
      throw new Error("Cannot delete producto that is used in alquileres");
    }
    await this.imageService.deleteManyFromProducto(id);
    await this.productoAdapter.deleteOne(id);
  }
}
