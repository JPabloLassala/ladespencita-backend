import { forwardRef, Module } from "@nestjs/common";
import { ProductoController } from "./producto.controller";
import { ProductoAdapter } from "./producto.adapter";
import { ProductoService } from "./producto.service";
import { DatabaseModule } from "src/database";
import { AlquilerModule } from "src/alquiler";
import { AlquilerProductoModule } from "src/alquiler-producto";
import { ImageModule } from "src/image";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductoEntity } from "./producto.entity";

@Module({
  imports: [
    forwardRef(() => DatabaseModule),
    forwardRef(() => ImageModule),
    forwardRef(() => AlquilerModule),
    forwardRef(() => AlquilerProductoModule),
    TypeOrmModule.forFeature([ProductoEntity]),
  ],
  controllers: [ProductoController],
  providers: [ProductoAdapter, ProductoService],
  exports: [ProductoAdapter],
})
export class ProductoModule {}
