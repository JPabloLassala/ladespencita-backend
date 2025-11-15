import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { Dayjs } from "dayjs";
import { AlquilerAdapter } from "src/Alquiler";
import { ProductoAdapter } from "./producto.adapter";
import { ProductoEntity, ProductoEntityCreate, ProductoEntityUpdate } from "./producto.entity";
import { AlquilerProductoAdapter } from "src/AlquilerProducto";
import { ImageService } from "src/Image/image.service";
import { ImageEntity } from "src/Image";

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
    const image = await this.imageService.createOne(file, result.id);

    return { ...result, image };
  }

  async updateOne(
    partialProducto: ProductoEntityUpdate,
    file: Express.Multer.File,
  ): Promise<ProductoEntity> {
    let image: ImageEntity;

    const updated = await this.productoAdapter.updateOne(partialProducto);
    if (file) {
      await this.imageService.deleteManyFromProducto(partialProducto.id);
      image = await this.imageService.createOne(file, partialProducto.id);
      updated.image = image;
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
