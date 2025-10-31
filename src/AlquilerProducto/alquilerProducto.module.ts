import { Module } from "@nestjs/common";
import { AlquilerProductoController } from "./alquilerProducto.controller";
import { AlquilerProductoRepository } from "./alquilerProducto.repository";
import { DatabaseModule } from "src/Database";
import { ALQUILERPRODUCTO_MODEL } from "src/constants/database";
import { AlquilerProductoDTO, AlquilerProductoSchema } from "./alquilerProducto.schema";
import { Connection, Model } from "mongoose";

const alquilerProductoModelProvider = {
  provide: ALQUILERPRODUCTO_MODEL,
  useFactory: (connection: Connection) => {
    return connection.model<AlquilerProductoDTO, Model<AlquilerProductoDTO>>(
      "AlquilerProducto",
      AlquilerProductoSchema,
    );
  },
  inject: ["DATABASE_CONNECTION"],
};

@Module({
  imports: [DatabaseModule],
  controllers: [AlquilerProductoController],
  providers: [alquilerProductoModelProvider, AlquilerProductoRepository],
  exports: [AlquilerProductoRepository],
})
export class AlquilerProductoModule {}
