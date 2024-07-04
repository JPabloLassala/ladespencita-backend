import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/Database";
import { AlquilerController } from "./alquiler.controller";
import { AlquilerRepository } from "./alquiler.repository";

@Module({
  imports: [DatabaseModule],
  controllers: [AlquilerController],
  providers: [AlquilerRepository],
  exports: [],
})
export class AlquilerModule {}
