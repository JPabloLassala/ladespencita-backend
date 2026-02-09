import { Module } from "@nestjs/common";
import { ImageController } from "./image.controller";
import { s3Provider } from "./s3.provider";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ImageEntity } from "./image.entity";
import { ImageService } from "./image.service";

@Module({
  imports: [TypeOrmModule.forFeature([ImageEntity])],
  controllers: [ImageController],
  providers: [s3Provider, ImageService],
  exports: [ImageService],
})
export class ImageModule {}
