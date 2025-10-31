import { Inject, Injectable } from "@nestjs/common";
import { AlquilerProducto } from "./alquilerProducto.entity";
import { ALQUILERPRODUCTO_MODEL } from "src/constants/database";
import {
  AlquilerProductoSchema,
  fromAlquilerProductoToSchema,
  fromSchemaToAlquilerProducto,
} from "./alquilerProducto.schema";

@Injectable()
export class AlquilerProductoRepository {
  constructor(
    @Inject(ALQUILERPRODUCTO_MODEL)
    private readonly alquilerProductoModel: typeof AlquilerProductoSchema,
  ) {}

  async getProductosFromAlquiler(id: string): Promise<AlquilerProducto[]> {
    const alquilerProductoSchemas = await this.alquilerProductoModel.findAll({
      where: { alquiler: { id } },
    });

    return alquilerProductoSchemas.map(fromSchemaToAlquilerProducto);
  }

  async createOne(partialAlquilerProducto: Partial<AlquilerProducto>): Promise<AlquilerProducto> {
    const asda = fromAlquilerProductoToSchema(partialAlquilerProducto as AlquilerProducto);
    const result = await this.alquilerProductoModel.create(asda);

    return fromSchemaToAlquilerProducto(result);
  }

  async createBulk(alquilerProductos: AlquilerProducto[]): Promise<void> {
    const apDtos = alquilerProductos.map((ap) => ({
      ...fromAlquilerProductoToSchema(ap),
      id: undefined,
    }));

    await AlquilerProductoSchema.bulkCreate(apDtos);
  }
}
