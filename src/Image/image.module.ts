import { Module } from "@nestjs/common";
import { ImageController } from "./image.controller";
import { s3Provider } from "./s3.provider";
import { ImageAdapter } from "./image.adapter";
import { ImageService } from "./image.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ImageEntity } from "./image.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ImageEntity])],
  controllers: [ImageController],
  providers: [ImageAdapter, s3Provider, ImageService],
  exports: [ImageService],
})
export class ImageModule {}
