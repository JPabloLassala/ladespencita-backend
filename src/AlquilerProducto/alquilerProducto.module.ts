import { forwardRef, Module } from "@nestjs/common";
import { AlquilerProductoController } from "./alquilerProducto.controller";
import { AlquilerProductoRepository } from "./alquilerProducto.repository";
import { DatabaseModule } from "src/Database";
import { ALQUILERPRODUCTO_MODEL } from "src/constants/database";
import { AlquilerProductoSchema } from "./alquilerProducto.schema";
import { ProductoModule } from "src/Producto";
import { AlquilerModule } from "src/Alquiler/alquiler.module";

export const alquilerProductoModelProvider = {
  provide: ALQUILERPRODUCTO_MODEL,
  useValue: AlquilerProductoSchema,
};

@Module({
  imports: [
    forwardRef(() => DatabaseModule),
    forwardRef(() => ProductoModule),
    forwardRef(() => AlquilerModule),
  ],
  controllers: [AlquilerProductoController],
  providers: [alquilerProductoModelProvider, AlquilerProductoRepository],
  exports: [AlquilerProductoRepository],
})
export class AlquilerProductoModule {}
