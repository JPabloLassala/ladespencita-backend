import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { FileFieldsInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { ImageRepository } from "./image.repository";

@Controller("/images")
export class ImageController {
  constructor(private readonly imageRepository: ImageRepository) {}

  @Post("uploadMany")
  @UseInterceptors(FileFieldsInterceptor([{ name: "files" }]))
  async uploadFiles(
    @UploadedFiles() multer: { files: Express.Multer.File[] },
    @Body("productoId") productoId: number,
  ) {
    const createFilePromises = multer.files.map(file =>
      this.imageRepository.createOne(file, productoId),
    );
    const result = await Promise.all(createFilePromises);

    return result;
  }

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async createOne(
    @UploadedFile("file") file: Express.Multer.File,
    @Body("productoId") productoId: string,
  ) {
    const result = await this.imageRepository.createOne(file, parseInt(productoId, 10));

    return result;
  }
}
