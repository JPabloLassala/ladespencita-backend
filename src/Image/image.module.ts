import { Module } from "@nestjs/common";
import { ImageController } from "./image.controller";
import { ImageRepository } from "./image.repository";
import { s3Provider } from "./s3.provider";
import { ImageSchema } from "./image.schema";
import { IMAGE_MODEL } from "src/constants";

export const imageModel = {
  provide: IMAGE_MODEL,
  useValue: ImageSchema,
};

@Module({
  controllers: [ImageController],
  providers: [ImageRepository, s3Provider, imageModel],
  exports: [imageModel, ImageRepository],
})
export class ImageModule {}
