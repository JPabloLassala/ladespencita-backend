import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ImageRepository } from "./image.repository";

@Controller("/images")
export class ImageController {
  constructor(private readonly imageRepository: ImageRepository) {}

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const result = await this.imageRepository.uploadFile(file);

    return result;
  }
}
