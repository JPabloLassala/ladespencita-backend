import { Controller, Logger, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { SheetService } from "./sheet.service";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("xls")
export class SheetController {
  constructor(private readonly sheetService: SheetService) {}

  @Post("parse")
  @UseInterceptors(FileInterceptor("file"))
  async parseExcel(@UploadedFile("file") file: Express.Multer.File): Promise<any> {
    Logger.log("Received request", SheetController.name);
    return this.sheetService.parseExcel(file);
  }
}
