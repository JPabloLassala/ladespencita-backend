import { Module } from "@nestjs/common";

import { ProductoController } from "./producto.controller";
import { ProductoRepository } from "./producto.repository";
import { DatabaseModule } from "src/Database";
import { Connection } from "mongoose";
import { PRODUCTO_MODEL } from "src/constants/database";
import { ProductoSchema } from "./producto.schema";

const productoModelProvider = {
  provide: PRODUCTO_MODEL,
  useFactory: (connection: Connection) => connection.model("Producto", ProductoSchema),
  inject: ["DATABASE_CONNECTION"],
};

@Module({
  imports: [DatabaseModule],
  controllers: [ProductoController],
  providers: [ProductoRepository, productoModelProvider],
})
export class ProductoModule {}
