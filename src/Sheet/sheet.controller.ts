import { Controller, Post } from "@nestjs/common";
import { SheetService } from "./sheet.service";

@Controller("xls")
export class SheetController {
  constructor(private readonly sheetService: SheetService) {}

  @Post("parse")
  async parseExcel(): Promise<any> {
    const filePath = "excel.ods";
    return this.sheetService.parseExcel(filePath);
  }
}
