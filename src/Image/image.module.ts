import { Module } from "@nestjs/common";
import { ImageController } from "./image.controller";
import { s3Provider } from "./s3.provider";
import { ImageAdapter } from "./image.adapter";
import { ImageService } from "./image.service";

@Module({
  controllers: [ImageController],
  providers: [ImageAdapter, s3Provider, ImageService],
  exports: [ImageService],
})
export class ImageModule {}
