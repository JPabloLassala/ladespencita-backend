import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
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
import { InStockQueryDto, ProductoCreateDTO, ProductoUpdateDTO } from "./producto.dto";
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
    @Query() dates: InStockQueryDto,
  ): Promise<ProductoEntity[]> {
    const since = dayjs(dates.since);
    const until = dayjs(dates.until);
    return await this.productoService.getProductosBetweenDates({ since, until });
  }

  @Get(":id")
  async getOne(@Param("id") id: number): Promise<ProductoEntity> {
    return await this.productoAdapter.getOne(id);
  }

  @Put(":id")
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(FileInterceptor("file"))
  async updateOne(
    @Body() updateProductDTO: ProductoUpdateDTO,
    @UploadedFile("file") file: Express.Multer.File,
    @Param("id") id: number,
  ): Promise<ProductoEntity> {
    return await this.productoService.updateOne(updateProductDTO.body, file);
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
