import { Module } from "@nestjs/common";
import { databaseProvider } from "./database.provider";
import { DatabaseService } from "./database.service";

@Module({
  providers: [databaseProvider, DatabaseService],
  exports: [databaseProvider, DatabaseService],
})
export class DatabaseModule {}
