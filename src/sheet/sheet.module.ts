import { Module } from "@nestjs/common";
import { SheetService } from "./sheet.service";
import { SheetController } from "./sheet.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductoEntity } from "src/producto";

@Module({
  imports: [TypeOrmModule.forFeature([ProductoEntity])],
  controllers: [SheetController],
  providers: [SheetService],
  exports: [],
})
export class SheetModule {}
