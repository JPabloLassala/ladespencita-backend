import { Module } from "@nestjs/common";
import { ImageController } from "./image.controller";
import { ImageRepository } from "./image.repository";

@Module({
  controllers: [ImageController],
  providers: [ImageRepository],
})
export class ImageModule {}
