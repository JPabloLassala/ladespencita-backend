import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ProductoAdapter } from "./producto.adapter";
import { ProductoService } from "./producto.service";
import dayjs from "dayjs";
import { FileInterceptor } from "@nestjs/platform-express";
import { ProductoEntity } from "./producto.entity";
import { ProductoCreateDTO, ProductoUpdateDTO } from "./producto.dto";
import { ImageService } from "src/modules/image";

@Controller("producto")
export class ProductoController {
  constructor(
    private readonly productoAdapter: ProductoAdapter,
    private readonly productoService: ProductoService,
    private readonly imageService: ImageService,
  ) {}

  @Get()
  async getAll(): Promise<ProductoEntity[]> {
    return await this.productoAdapter.getAll();
  }

  @Get("/in-stock")
  async getProductosBetweenDates(
    @Body() dates: { since: string; until: string },
  ): Promise<ProductoEntity[]> {
    const since = dayjs(dates.since);
    const until = dayjs(dates.until);
    return await this.productoService.getProductosBetweenDates({ since, until });
  }

  @Get(":id")
  async getOne(@Param("id") id: number): Promise<ProductoEntity> {
    try {
      return await this.productoAdapter.getOne(id);
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: "Internal Server Error" },
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  @Put(":id")
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(FileInterceptor("file"))
  async updateOne(
    @Body() updateProductDTO: ProductoUpdateDTO,
    @UploadedFile("file") file: Express.Multer.File,
    @Param("id") id: number,
  ): Promise<ProductoEntity> {
    try {
      return await this.productoService.updateOne(updateProductDTO.body, file);
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.NOT_MODIFIED, error: "Internal Server Error" },
        HttpStatus.NOT_MODIFIED,
        { cause: error },
      );
    }
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(FileInterceptor("file"))
  async create(
    @Body() body: ProductoCreateDTO,
    @UploadedFile("file") file: Express.Multer.File,
  ): Promise<ProductoEntity> {
    return await this.productoService.createOne(body.body, file);
  }

  @Delete(":id")
  async deleteOne(@Param("id") id: number): Promise<void> {
    return await this.productoService.deleteOne(id);
  }
}
