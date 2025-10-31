import { forwardRef, Module } from "@nestjs/common";
import { AlquilerProductoController } from "./alquilerProducto.controller";
import { AlquilerProductoAdapter } from "./alquilerProducto.adapter";
import { DatabaseModule } from "src/Database";
import { ProductoModule } from "src/Producto";
import { AlquilerModule } from "src/Alquiler";

@Module({
  imports: [
    forwardRef(() => DatabaseModule),
    forwardRef(() => ProductoModule),
    forwardRef(() => AlquilerModule),
  ],
  controllers: [AlquilerProductoController],
  providers: [AlquilerProductoAdapter],
  exports: [AlquilerProductoAdapter],
})
export class AlquilerProductoModule {}
