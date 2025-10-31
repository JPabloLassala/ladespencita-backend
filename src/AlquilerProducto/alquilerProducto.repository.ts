import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { AlquilerProducto } from "./alquilerProducto.entity";
import { ALQUILERPRODUCTO_MODEL, PRODUCTO_MODEL } from "src/constants/database";
import {
  AlquilerProductoSchema,
  fromAlquilerProductoToSchema,
  fromSchemaToAlquilerProducto,
} from "./alquilerProducto.schema";
import { ProductoRepository, ProductoSchema } from "src/Producto";
import { Op } from "sequelize";
import { Dayjs } from "dayjs";
import { AlquilerRepository } from "src/Alquiler";
import { HigherThanStockError } from "./alquilerProducto.errors";

@Injectable()
export class AlquilerProductoRepository {
  constructor(
    @Inject(ALQUILERPRODUCTO_MODEL)
    private readonly alquilerProductoModel: typeof AlquilerProductoSchema,
    @Inject(PRODUCTO_MODEL)
    private readonly productoModel: typeof ProductoSchema,
    @Inject(forwardRef(() => AlquilerRepository))
    private readonly alquilerRepository: AlquilerRepository,
    @Inject(forwardRef(() => ProductoRepository))
    private readonly productoRepository: ProductoRepository,
  ) {}

  async getProductosFromAlquiler(id: number): Promise<AlquilerProducto[]> {
    const alquilerProductoSchemas = await this.alquilerProductoModel.findAll({
      where: { "$alquiler.id$": id },
      include: [{ all: true }],
    });

    return alquilerProductoSchemas.map(fromSchemaToAlquilerProducto);
  }

  async createAlquilerProductos(
    alquilerId: number,
    alquilerProductos: AlquilerProducto[],
  ): Promise<void> {
    const productoIds = alquilerProductos.map(ap => ap.productoId);
    const productos = await this.productoModel.findAll({ where: { id: productoIds } });

    const exceededAlquilerProductos = this.findQuantityHigherThanStock([], [], productos);

    if (exceededAlquilerProductos.length > 0) {
      throw new Error(
        `La cantidad de los siguientes productos supera el stock: ${JSON.stringify(exceededAlquilerProductos)}`,
      );
    }

    const apDtos = alquilerProductos.map(ap => ({
      ...fromAlquilerProductoToSchema(ap),
      id: undefined,
      alquilerId,
    }));

    await AlquilerProductoSchema.bulkCreate(apDtos);
  }

  async createOne(partialAlquilerProducto: Partial<AlquilerProducto>): Promise<AlquilerProducto> {
    const asda = fromAlquilerProductoToSchema(partialAlquilerProducto as AlquilerProducto);
    const result = await this.alquilerProductoModel.create(asda);

    return fromSchemaToAlquilerProducto(result);
  }

  async createBulk(alquilerProductos: AlquilerProducto[]): Promise<void> {
    const apDtos = alquilerProductos.map(ap => ({
      ...fromAlquilerProductoToSchema(ap),
      id: undefined,
    }));

    await AlquilerProductoSchema.bulkCreate(apDtos);
  }

  async updateAlquilerProductos(newAlquilerProductos: Partial<AlquilerProducto>[]): Promise<void> {
    const productoIds = newAlquilerProductos.map(ap => ap.productoId);
    const productos = await this.productoModel.findAll({ where: { id: productoIds } });
    const existingAlquilerProductos = await this.alquilerProductoModel.findAll({
      where: { productoId: productoIds },
    });

    const exceededAlquilerProductos = this.findQuantityHigherThanStock(
      newAlquilerProductos,
      existingAlquilerProductos,
      productos,
    );

    if (exceededAlquilerProductos.length > 0) {
      throw new Error(
        `La cantidad de los siguientes productos supera el stock: ${JSON.stringify(exceededAlquilerProductos)}`,
      );
    }

    const apDtos = newAlquilerProductos.map(ap => ({
      ...fromAlquilerProductoToSchema(ap as AlquilerProducto),
      id: undefined,
    }));

    await AlquilerProductoSchema.bulkCreate(apDtos, { updateOnDuplicate: ["cantidad"] });
  }

  private findQuantityHigherThanStock(
    newAlquilerProductos: Partial<AlquilerProducto>[],
    existingAlquilerProductos: AlquilerProductoSchema[],
    productos: ProductoSchema[],
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

      if (stockUsed + nap.cantidad > producto.stock) {
        quantityHigherThanStock.push({
          alquilerId: nap.alquilerId,
          productoId: nap.productoId,
          stock: producto.stock,
          requested: stockUsed + nap.cantidad,
        });
      }
    }

    return quantityHigherThanStock;
  }

  async getProductosFromAlquilerIds(alquilerIds: number[]): Promise<AlquilerProducto[]> {
    const alquilerProductos = await this.alquilerProductoModel.findAll({
      where: { alquilerId: alquilerIds },
      include: [{ all: true }],
    });

    return alquilerProductos.map(fromSchemaToAlquilerProducto);
  }

  async isAbleToRentBetweenDates(
    since: Dayjs,
    until: Dayjs,
    alquilerProductos: Partial<AlquilerProducto>[],
  ): Promise<boolean> {
    console.log(since, until);
    const alquileres = await this.alquilerRepository.getAlquileresBetweenDates({
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
    const productoStocks = await this.productoRepository.getStockPerId();
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

  async getFromAlquilerIds(alquilerIds: number[]): Promise<AlquilerProducto[]> {
    const result = await this.alquilerProductoModel.findAll({
      where: {
        alquilerId: {
          [Op.in]: alquilerIds,
        },
      },
    });

    return result.map(fromSchemaToAlquilerProducto);
  }

  async getFromIds(productoIds: number[]): Promise<AlquilerProducto[]> {
    const result = await this.alquilerProductoModel.findAll({
      where: {
        productoId: {
          [Op.in]: productoIds,
        },
      },
    });

    return result.map(fromSchemaToAlquilerProducto);
  }
}
