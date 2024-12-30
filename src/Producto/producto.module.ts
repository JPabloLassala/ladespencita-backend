import { forwardRef, Module } from "@nestjs/common";
import { ProductoController } from "./producto.controller";
import { ProductoRepository } from "./producto.repository";
import { ProductoService } from "./producto.service";
import { ProductoSchema } from "./producto.schema";
import { PRODUCTO_MODEL } from "src/constants";
import { DatabaseModule } from "src/Database";
import { AlquilerModule } from "src/Alquiler";
import { AlquilerProductoModule } from "src/AlquilerProducto";

export const productoModel = {
  provide: PRODUCTO_MODEL,
  useValue: ProductoSchema,
};

@Module({
  imports: [
    forwardRef(() => DatabaseModule),
    forwardRef(() => AlquilerModule),
    forwardRef(() => AlquilerProductoModule),
  ],
  controllers: [ProductoController],
  providers: [ProductoRepository, ProductoService, productoModel],
  exports: [productoModel],
})
export class ProductoModule {}
