import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/Database";
import { AlquilerController } from "./alquiler.controller";
import { AlquilerAdapter } from "./alquiler.adapter";
import { AlquilerService } from "./alquiler.service";

@Module({
  imports: [DatabaseModule],
  controllers: [AlquilerController],
  providers: [AlquilerAdapter, AlquilerService],
  exports: [AlquilerService],
})
export class AlquilerModule {}
