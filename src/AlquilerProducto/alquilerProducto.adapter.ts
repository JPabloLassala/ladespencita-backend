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

  async checkRemaining(
    since: Date,
    until: Date,
  ): Promise<{ productoId: number; stock: number; used: number; remaining: number }[]> {
    console.log("since", since);
    console.log("until", until);
    const usedAlquilerProductos = await this.alquilerProductoRepository
      .createQueryBuilder("alquilerProductos")
      .select("CAST(sum(alquilerProductos.cantidad) AS INTEGER)", "used")
      .addSelect("alquilerProductos.productoId", "productoId")
      .innerJoin("alquilerProductos.alquiler", "alquiler")
      .where("alquiler.status IN (:...status)", {
        status: [ALQUILER_STATUS.ACTIVE, ALQUILER_STATUS.BUDGETED],
      })
      .andWhere(
        `((alquiler.fechaInicio BETWEEN :since AND :until)
          OR (alquiler.fechaFin BETWEEN :since AND :until) 
          OR (:since BETWEEN alquiler.fechaInicio AND alquiler.fechaFin) 
          OR (:until BETWEEN alquiler.fechaInicio AND alquiler.fechaFin))`,
        { since, until },
      )
      .groupBy("alquilerProductos.productoId")
      .getRawMany<{ used: number; productoId: number }>();

    const productos = await this.productoRepository.find();

    return productos.map(p => {
      const ap = usedAlquilerProductos.find(sp => sp.productoId === p.id);
      const used = ap ? ap.used : 0;
      return {
        productoId: p.id,
        stock: p.totales,
        used: used,
        remaining: p.totales - used,
      };
    });
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

  async deleteByAlquilerId(alquilerId: number): Promise<void> {
    await this.alquilerProductoRepository.delete({
      alquilerId: alquilerId,
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
