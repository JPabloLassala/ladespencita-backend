import { Module } from "@nestjs/common";
import { SheetService } from "./sheet.service";
import { SheetController } from "./sheet.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductoEntity } from "src/modules/producto";
import { S3Provider } from "src/infrastructure/s3";

@Module({
  imports: [TypeOrmModule.forFeature([ProductoEntity])],
  controllers: [SheetController],
  providers: [SheetService, S3Provider],
  exports: [],
})
export class SheetModule {}
