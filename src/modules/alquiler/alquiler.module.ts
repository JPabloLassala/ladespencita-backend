import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/database";
import { AlquilerController } from "./alquiler.controller";
import { AlquilerAdapter } from "./alquiler.adapter";
import { AlquilerService } from "./alquiler.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AlquilerEntity } from ".";
import { AlquilerProductoModule } from "src/modules/alquiler-producto";

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([AlquilerEntity]), AlquilerProductoModule],
  controllers: [AlquilerController],
  providers: [AlquilerAdapter, AlquilerService],
  exports: [AlquilerService, AlquilerAdapter],
})
export class AlquilerModule {}
