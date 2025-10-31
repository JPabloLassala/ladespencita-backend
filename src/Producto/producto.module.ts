import { forwardRef, Module } from "@nestjs/common";
import { ProductoController } from "./producto.controller";
import { ProductoAdapter } from "./producto.adapter";
import { ProductoService } from "./producto.service";
import { DatabaseModule } from "src/Database";
import { AlquilerModule } from "src/Alquiler";
import { AlquilerProductoModule } from "src/AlquilerProducto";
import { ImageModule } from "src/Image";

@Module({
  imports: [
    forwardRef(() => DatabaseModule),
    forwardRef(() => ImageModule),
    forwardRef(() => AlquilerModule),
    forwardRef(() => AlquilerProductoModule),
  ],
  controllers: [ProductoController],
  providers: [ProductoAdapter, ProductoService],
  exports: [ProductoAdapter],
})
export class ProductoModule {}
