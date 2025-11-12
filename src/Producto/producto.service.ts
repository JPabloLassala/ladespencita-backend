import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { Dayjs } from "dayjs";
import { AlquilerAdapter } from "src/Alquiler";
import { ProductoAdapter } from "./producto.adapter";
import { ProductoEntity, ProductoEntityCreate } from "./producto.entity";
import { AlquilerProductoAdapter } from "src/AlquilerProducto";
import { ImageService } from "src/Image/image.service";

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

  async updateOne(partialProducto: Partial<ProductoEntity>): Promise<ProductoEntity> {
    return this.productoAdapter.updateOne(partialProducto);
  }

  async createOne(
    partialProducto: ProductoEntityCreate,
    file: Express.Multer.File,
  ): Promise<ProductoEntity> {
    const result = await this.productoAdapter.createOne(partialProducto);
    await this.imageService.createOne(file, result.id);

    return result;
  }

  async deleteOne(id: number): Promise<void> {
    const alquileres = await this.alquilerAdapter.getAlquileresWithProductoId(id);

    if (alquileres.length > 0) {
      throw new Error("Cannot delete producto that is used in alquileres");
    }
    await this.imageService.deleteManyFromProducto(id);
  }
}
