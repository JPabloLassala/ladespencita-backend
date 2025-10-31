import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { Dayjs } from "dayjs";
import { AlquilerRepository } from "src/Alquiler";
import { AlquilerProductoRepository } from "src/AlquilerProducto";
import { Producto } from "./producto.entity";
import { ProductoRepository } from "./producto.repository";

@Injectable()
export class ProductoService {
  constructor(
    @Inject(forwardRef(() => AlquilerProductoRepository))
    private readonly alquilerProductoRepository: AlquilerProductoRepository,
    @Inject(forwardRef(() => AlquilerRepository))
    private readonly alquilerRepository: AlquilerRepository,
    private readonly productoRepository: ProductoRepository,
  ) {}

  async getProductosBetweenDates({
    since,
    until,
  }: {
    since: Dayjs;
    until: Dayjs;
  }): Promise<Producto[]> {
    const alquileres = await this.alquilerRepository.getAlquileresBetweenDates({
      since,
      until,
    });
    Logger.log(alquileres);
    const alquilerProductos = await this.alquilerProductoRepository.getProductosFromAlquilerIds(
      alquileres.map(a => a.id),
    );
    const productos = await this.productoRepository.getAll();
    const productosInStock = productos.map(p => {
      const alquilerProducto = alquilerProductos.filter(ap => ap.productoId === p.id);
      const amount = alquilerProducto.reduce((acc, ap) => acc + ap.cantidad, 0);

      return { ...p, cantidad: p.totales - amount };
    });

    return productosInStock;
  }
}
