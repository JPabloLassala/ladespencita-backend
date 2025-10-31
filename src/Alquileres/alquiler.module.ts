import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/Database";
import { AlquilerController } from "./alquiler.controller";
import { AlquilerRepository } from "./alquiler.repository";
import { ALQUILER_MODEL } from "src/constants/database";
import { Connection } from "mongoose";
import { AlquilerRecordDTO, AlquilerSchema } from "./alquiler.schema";
import { SoftDeleteModel, softDeletePlugin } from "soft-delete-plugin-mongoose";

const alquilerModelProvider = {
  provide: ALQUILER_MODEL,
  useFactory: (connection: Connection) => {
    AlquilerSchema.plugin(softDeletePlugin);

    return connection.model<AlquilerRecordDTO, SoftDeleteModel<AlquilerRecordDTO>>(
      "Alquiler",
      AlquilerSchema,
    );
  },
  inject: ["DATABASE_CONNECTION"],
};

@Module({
  imports: [DatabaseModule],
  controllers: [AlquilerController],
  providers: [AlquilerRepository, alquilerModelProvider],
  exports: [],
})
export class AlquilerModule {}
