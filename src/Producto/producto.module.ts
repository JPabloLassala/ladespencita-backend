import { Module } from "@nestjs/common";

import { ProductoController } from "./producto.controller";
import { ProductoRepository } from "./producto.repository";
import { DatabaseModule } from "src/Database";
import { Connection, Model } from "mongoose";
import { PRODUCTO_MODEL } from "src/constants/database";
import { ProductoRecordDTO, ProductoSchema } from "./producto.schema";
import { ProductoService } from "./producto.service";
import { AlquilerModule } from "src/Alquiler";
import { AlquilerProductoModule } from "src/AlquilerProducto";

const productoModelProvider = {
  provide: PRODUCTO_MODEL,
  useFactory: (connection: Connection) => {
    return connection.model<ProductoRecordDTO, Model<ProductoRecordDTO>>(
      "Producto",
      ProductoSchema,
    );
  },
  inject: ["DATABASE_CONNECTION"],
};

@Module({
  imports: [DatabaseModule, AlquilerModule, AlquilerProductoModule],
  controllers: [ProductoController],
  providers: [ProductoRepository, productoModelProvider, ProductoService],
})
export class ProductoModule {}
