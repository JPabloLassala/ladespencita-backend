import { forwardRef, Module } from "@nestjs/common";
import { AlquilerProductoController } from "./alquilerProducto.controller";
import { AlquilerProductoAdapter } from "./alquilerProducto.adapter";
import { DatabaseModule } from "src/Database";
import { ProductoEntity, ProductoModule } from "src/Producto";
import { AlquilerModule } from "src/Alquiler";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AlquilerProductoEntity } from "./alquilerProducto.entity";
import { AlquilerProductoService } from "./alquilerProducto.service";

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
