import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Dayjs } from "dayjs";
import { ALQUILER_STATUS, AlquilerAdapter } from "src/Alquiler";
import { HigherThanStockError } from "./alquilerProducto.errors";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductoAdapter, ProductoEntity } from "src/Producto";
import { In, Repository } from "typeorm";
import {
  AlquilerProductoCreate,
  AlquilerProductoEntity,
  AlquilerProductoUpdate,
} from "./alquilerProducto.entity";
import { ProductoHigherThanAvailableError, UsedProductoError } from "src/Alquiler/alquiler.error";
import { AlquilerProductoRemaining } from "./alquilerProducto.types";

@Injectable()
export class AlquilerProductoAdapter {
  constructor(
    @InjectRepository(AlquilerProductoEntity)
    private readonly alquilerProductoRepository: Repository<AlquilerProductoEntity>,
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
    @Inject(forwardRef(() => AlquilerAdapter))
    private readonly alquilerAdapter: AlquilerAdapter,
    @Inject(forwardRef(() => ProductoAdapter))
    private readonly productoAdapter: ProductoAdapter,
  ) {}

  async getProductosFromAlquiler(id: number): Promise<AlquilerProductoEntity[]> {
    return await this.alquilerProductoRepository.findBy({ alquilerId: id });
  }

  async getRemainingStock(): Promise<AlquilerProductoRemaining[]> {
    const productos = await this.productoRepository.find();
    const usedAlquilerProductos = await this.alquilerProductoRepository
      .createQueryBuilder("alquilerProductos")
      .select("CAST(sum(alquilerProductos.cantidad) AS INTEGER)", "used")
      .addSelect("alquilerProductos.productoId", "productoId")
      .innerJoin("alquilerProductos.alquiler", "alquiler")
      .where("alquiler.status = :status", { status: ALQUILER_STATUS.ACTIVE })
      .groupBy("alquilerProductos.productoId")
      .getRawMany<{ used: number; productoId: number }>();

    return productos.map(p => {
      const usedProducto = usedAlquilerProductos.find(uap => uap.productoId === p.id);
      const usedQty = usedProducto ? usedProducto.used : 0;

      return {
        productoId: p.id,
        used: usedQty,
        remaining: p.totales - usedQty,
      };
    });
  }

  async checkAlquilerProductosAvailability(
    alquilerProductos: AlquilerProductoCreate[],
  ): Promise<void> {
    const productoIds = alquilerProductos.map(ap => ap.productoId);
    const productos = await this.productoRepository.findBy({ id: In(productoIds) });
    const usedAlquilerProductos = await this.alquilerProductoRepository
      .createQueryBuilder("alquilerProductos")
      .select("CAST(sum(alquilerProductos.cantidad) AS INTEGER)", "used")
      .addSelect("alquilerProductos.productoId", "productoId")
      .innerJoin("alquilerProductos.alquiler", "alquiler")
      .where("alquiler.status = :status", { status: ALQUILER_STATUS.ACTIVE })
      .groupBy("alquilerProductos.productoId")
      .having("alquilerProductos.productoId IN (:...productoIds)", { productoIds })
      .getRawMany<{ used: number; productoId: number }>();

    const stocksProductos = productos.reduce<{ stock: number; productoId: number }[]>((acc, p) => {
      acc.push({ productoId: p.id, stock: p.totales });
      return acc;
    }, []);

    const requestedHigherThanStock = alquilerProductos.filter(ap => {
      const usedProducto = usedAlquilerProductos.find(uap => uap.productoId === ap.productoId);
      const usedQty = usedProducto ? usedProducto.used : 0;
      const stock = stocksProductos.find(ps => ps.productoId === ap.productoId)?.stock || 0;

      return usedQty + ap.cantidad > stock;
    });

    if (requestedHigherThanStock.length > 0) {
      const error: UsedProductoError[] = requestedHigherThanStock.map(ap => {
        const usedProducto = usedAlquilerProductos.find(uap => uap.productoId === ap.productoId);
        const usedQty = usedProducto ? usedProducto.used : 0;
        const stock = stocksProductos.find(ps => ps.productoId === ap.productoId)?.stock || 0;

        return {
          productoId: ap.productoId,
          used: usedQty,
          stock,
          requested: ap.cantidad,
        };
      });

      throw new ProductoHigherThanAvailableError(error);
    }
  }

  async createAlquilerProductos(
    alquilerId: number,
    alquilerProductos: AlquilerProductoCreate[],
  ): Promise<AlquilerProductoEntity[]> {
    const alquilerProductoEntities = alquilerProductos.map(ap => {
      ap["id"] = undefined;
      return this.alquilerProductoRepository.create({
        ...ap,
        alquilerId,
      });
    });

    return await this.alquilerProductoRepository.save(alquilerProductoEntities);
  }

  async createOne(newAlquilerProducto: AlquilerProductoCreate): Promise<AlquilerProductoEntity> {
    const producto = await this.productoRepository.findOneBy({
      id: newAlquilerProducto.productoId,
    });
    const existingAlquilerProductos = await this.alquilerProductoRepository.findBy({
      productoId: producto.id,
    });
    const exceededAlquilerProductos = this.findQuantityHigherThanStock(
      [newAlquilerProducto],
      existingAlquilerProductos,
      [producto],
    );

    if (exceededAlquilerProductos.length > 0) {
      throw new Error(
        `La cantidad de los siguientes productos supera el stock: ${JSON.stringify(exceededAlquilerProductos)}`,
      );
    }

    return await this.alquilerProductoRepository.create(newAlquilerProducto);
  }

  async createMany(
    alquilerProductos: AlquilerProductoCreate[],
    alquilerId: number,
  ): Promise<AlquilerProductoEntity[]> {
    return await this.alquilerProductoRepository.save(
      alquilerProductos.map(ap => ({ ...ap, alquilerId })),
    );
  }

  async updateAlquilerProducto(alquilerProducto: AlquilerProductoUpdate): Promise<void> {
    const producto = await this.productoRepository.findOne({
      where: { id: alquilerProducto.productoId },
    });
    const existingAlquilerProductos = await this.alquilerProductoRepository.findBy({
      productoId: producto.id,
    });

    const exceededAlquilerProductos = this.findQuantityHigherThanStock(
      [alquilerProducto],
      existingAlquilerProductos,
      [producto],
    );

    if (exceededAlquilerProductos.length > 0) {
      throw new Error(
        `La cantidad de los siguientes productos supera el stock: ${JSON.stringify(exceededAlquilerProductos)}`,
      );
    }

    await this.alquilerProductoRepository.update({ id: alquilerProducto.id }, alquilerProducto);
  }

  private findQuantityHigherThanStock(
    newAlquilerProductos: AlquilerProductoCreate[] | AlquilerProductoUpdate[],
    existingAlquilerProductos: AlquilerProductoEntity[],
    productos: ProductoEntity[],
  ): {
    alquilerId: number;
    productoId: number;
    stock: number;
    requested: number;
  }[] {
    const quantityHigherThanStock: {
      alquilerId: number;
      productoId: number;
      stock: number;
      requested: number;
    }[] = [];

    for (const nap of newAlquilerProductos) {
      const producto = productos.find(p => p.id === nap.productoId);
      const existing = existingAlquilerProductos.filter(eap => eap.productoId === nap.productoId);
      const stockUsed = existing.reduce((acc, eap) => acc + eap.cantidad, 0);

      if (stockUsed + nap.cantidad > producto.totales) {
        quantityHigherThanStock.push({
          alquilerId: nap.alquilerId,
          productoId: nap.productoId,
          stock: producto.totales,
          requested: stockUsed + nap.cantidad,
        });
      }
    }

    return quantityHigherThanStock;
  }

  async getProductosFromAlquilerIds(alquilerIds: number[]): Promise<AlquilerProductoEntity[]> {
    return await this.alquilerProductoRepository.find({
      where: { alquilerId: In(alquilerIds) },
      relations: { alquiler: true, producto: true },
    });
  }

  async isAbleToRentBetweenDates(
    since: Dayjs,
    until: Dayjs,
    alquilerProductos: Partial<AlquilerProductoEntity>[],
  ): Promise<boolean> {
    console.log(since, until);
    const alquileres = await this.alquilerAdapter.getAlquileresBetweenDates({
      since,
      until,
    });
    const alquilerIds = alquileres.map(a => a.id);
    const existingAlquilerProductos = await this.getFromAlquilerIds(alquilerIds);
    const quantityPerProducto = existingAlquilerProductos.reduce<Record<number, number>>(
      (acc, eap) => {
        if (!acc[eap.productoId]) {
          acc[eap.productoId] = 0;
        }

        acc[eap.productoId] += eap.cantidad;

        return acc;
      },
      {},
    );
    const productoStocks = await this.productoAdapter.getStockPerId();
    const stockPerAlquilerProductoSet: Map<number, any> = alquilerProductos.reduce((acc, ap) => {
      const stock = productoStocks.get(ap.productoId) || 0;

      if (!acc.has(ap.productoId)) {
        acc.set(ap.productoId, {
          stock,
          requested: 0,
        });
      }

      const current = acc.get(ap.productoId);
      current.requested += ap.cantidad;

      return acc;
    }, new Map());
    const higherThanStock = Array.from(stockPerAlquilerProductoSet.entries()).filter(
      ([productoId, { stock, requested }]) => {
        const existing = quantityPerProducto[productoId] || 0;

        return existing + requested > stock;
      },
    );

    if (higherThanStock.length > 0) {
      throw new HigherThanStockError(higherThanStock);
    }

    return true;
  }

  async updateMany(alquilerProductos: AlquilerProductoUpdate[]): Promise<AlquilerProductoEntity[]> {
    await Promise.all(
      alquilerProductos.map(ap => this.alquilerProductoRepository.update({ id: ap.id }, { ...ap })),
    );

    const updatedIds = alquilerProductos.map(ap => ap.id);
    return await this.alquilerProductoRepository.findBy({ id: In(updatedIds) });
  }

  async deleteMany(ids: number[]): Promise<void> {
    await this.alquilerProductoRepository.delete({
      id: In(ids),
    });
  }

  async getFromAlquilerIds(alquilerIds: number[]): Promise<AlquilerProductoEntity[]> {
    return await this.alquilerProductoRepository.findBy({
      alquilerId: In(alquilerIds),
    });
  }

  async getFromIds(productoIds: number[]): Promise<AlquilerProductoEntity[]> {
    return await this.alquilerProductoRepository.findBy({
      productoId: In(productoIds),
    });
  }
}
