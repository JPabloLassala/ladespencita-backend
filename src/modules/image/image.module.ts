import { Module } from "@nestjs/common";
import { ImageController } from "./image.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ImageEntity } from "./image.entity";
import { ImageService } from "./image.service";
import { S3Provider } from "src/infrastructure/s3";

@Module({
  imports: [TypeOrmModule.forFeature([ImageEntity])],
  controllers: [ImageController],
  providers: [S3Provider, ImageService],
  exports: [ImageService],
})
export class ImageModule {}
