import { forwardRef, Module } from "@nestjs/common";
import { AlquilerProductoController } from "./alquiler-producto.controller";
import { AlquilerProductoAdapter } from "./alquiler-producto.adapter";
import { DatabaseModule } from "src/infrastructure/database";
import { ProductoEntity, ProductoModule } from "src/modules/producto";
import { AlquilerModule } from "src/modules/alquiler";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AlquilerProductoEntity } from "./alquiler-producto.entity";
import { AlquilerProductoService } from "./alquiler-producto.service";

@Module({
  imports: [
    forwardRef(() => DatabaseModule),
    forwardRef(() => ProductoModule),
    forwardRef(() => AlquilerModule),
    TypeOrmModule.forFeature([AlquilerProductoEntity, ProductoEntity]),
  ],
  controllers: [AlquilerProductoController],
  providers: [AlquilerProductoAdapter, AlquilerProductoService],
  exports: [AlquilerProductoAdapter, AlquilerProductoService],
})
export class AlquilerProductoModule {}
