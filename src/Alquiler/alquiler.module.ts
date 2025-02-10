import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/Database";
import { AlquilerController } from "./alquiler.controller";
import { AlquilerRepository } from "./alquiler.repository";
import { ALQUILER_MODEL } from "src/constants/database";
import { AlquilerSchema } from "./alquiler.schema";

export const alquilerModel = {
  provide: ALQUILER_MODEL,
  useValue: AlquilerSchema,
};

@Module({
  imports: [DatabaseModule],
  controllers: [AlquilerController],
  providers: [AlquilerRepository, alquilerModel],
  exports: [AlquilerRepository, alquilerModel],
})
export class AlquilerModule {}
