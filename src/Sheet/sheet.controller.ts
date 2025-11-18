import { Body, Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { SheetService } from "./sheet.service";
import { ProductoCreateDTO } from "src/Producto/producto.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("xls")
export class SheetController {
  constructor(private readonly sheetService: SheetService) {}

  @Post("parse")
  @UseInterceptors(FileInterceptor("file"))
  async parseExcel(@UploadedFile("file") file: Express.Multer.File): Promise<any> {
    return this.sheetService.parseExcel(file);
  }
}
