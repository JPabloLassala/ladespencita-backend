import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/Database";
import { AlquilerController } from "./alquiler.controller";
import { AlquilerRepository } from "./alquiler.repository";
import { ALQUILER_MODEL } from "src/constants/database";
import { Connection } from "mongoose";
import { AlquilerSchema } from "./alquiler.schema";

const alquilerModelProvider = {
  provide: ALQUILER_MODEL,
  useFactory: (connection: Connection) => connection.model("Alquiler", AlquilerSchema),
  inject: ["DATABASE_CONNECTION"],
};

@Module({
  imports: [DatabaseModule],
  controllers: [AlquilerController],
  providers: [AlquilerRepository, alquilerModelProvider],
  exports: [],
})
export class AlquilerModule {}
