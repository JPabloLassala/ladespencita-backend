import { Module } from "@nestjs/common";
import { ImageController } from "./image.controller";
import { ImageRepository } from "./image.repository";
import { s3Provider } from "./s3.provider";

@Module({
  controllers: [ImageController],
  providers: [ImageRepository, s3Provider],
})
export class ImageModule {}
