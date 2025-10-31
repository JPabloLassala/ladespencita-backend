import { Inject, Injectable } from "@nestjs/common";
import {
  AlquilerProductoDTO,
  fromAlquilerProductoToDto,
  fromDtoToAlquilerProducto,
} from "./alquilerProducto.schema";
import { AlquilerProducto } from "./alquilerProducto.entity";
import { Model } from "mongoose";
import { ALQUILERPRODUCTO_MODEL } from "src/constants/database";

@Injectable()
export class AlquilerProductoRepository {
  constructor(
    @Inject(ALQUILERPRODUCTO_MODEL)
    private readonly alquilerProductoModel: Model<AlquilerProductoDTO>,
  ) {}

  async getProductosFromAlquiler(alquilerId: string): Promise<AlquilerProducto[]> {
    const alquilerProductoDocs = await this.alquilerProductoModel.find({ alquilerId }).exec();

    return alquilerProductoDocs.map(fromDtoToAlquilerProducto);
  }

  async createOne(partialAlquilerProducto: Partial<AlquilerProducto>): Promise<AlquilerProducto> {
    const result = await this.alquilerProductoModel.create(partialAlquilerProducto);

    return fromDtoToAlquilerProducto(result);
  }

  async createBulk(alquilerProductos: AlquilerProducto[]): Promise<void> {
    const apDtos = alquilerProductos.map((ap) => ({
      ...fromAlquilerProductoToDto(ap),
      _id: undefined,
    }));
    await this.alquilerProductoModel.collection.insertMany(apDtos);
  }
}
