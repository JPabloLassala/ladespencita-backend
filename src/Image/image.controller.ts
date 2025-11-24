import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { FileFieldsInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { ImageService } from "./image.service";

@Controller("/images")
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post("uploadMany")
  @UseInterceptors(FileFieldsInterceptor([{ name: "files" }]))
  async uploadFiles(
    @UploadedFiles() multer: { files: Express.Multer.File[] },
    @Body("productoId") productoId: number,
  ) {
    const createFilePromises = multer.files.map(file => this.imageService.create(file, productoId));
    const result = await Promise.all(createFilePromises);

    return result;
  }

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async createOne(
    @UploadedFile("file") file: Express.Multer.File,
    @Body("productoId") productoId: string,
  ) {
    const result = await this.imageService.create(file, parseInt(productoId, 10));

    return result;
  }
}
