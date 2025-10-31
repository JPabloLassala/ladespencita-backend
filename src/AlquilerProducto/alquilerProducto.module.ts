import { forwardRef, Module } from "@nestjs/common";
import { AlquilerProductoController } from "./alquilerProducto.controller";
import { AlquilerProductoRepository } from "./alquilerProducto.repository";
import { DatabaseModule } from "src/Database";
import { ALQUILERPRODUCTO_MODEL } from "src/constants/database";
import { AlquilerProductoSchema } from "./alquilerProducto.schema";
import { ProductoModule } from "src/Producto";

export const alquilerProductoModelProvider = {
  provide: ALQUILERPRODUCTO_MODEL,
  useValue: AlquilerProductoSchema,
};

@Module({
  imports: [forwardRef(() => DatabaseModule), forwardRef(() => ProductoModule)],
  controllers: [AlquilerProductoController],
  providers: [alquilerProductoModelProvider, AlquilerProductoRepository],
  exports: [AlquilerProductoRepository],
})
export class AlquilerProductoModule {}
