import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ProductoRepository } from "./producto.repository";
import { Producto, ProductoCreate } from "./producto.entity";
import { ProductoService } from "./producto.service";
import dayjs from "dayjs";
import { FileInterceptor } from "@nestjs/platform-express";
import { ImageRepository } from "src/Image";

@Controller("producto")
export class ProductoController {
  constructor(
    private readonly productoRepository: ProductoRepository,
    private readonly productoService: ProductoService,
    private readonly imageRepository: ImageRepository,
  ) {}

  @Get()
  async getAll(): Promise<Producto[]> {
    return await this.productoRepository.getAll();
  }

  @Get("/in-stock")
  async getProductosBetweenDates(
    @Body() dates: { since: string; until: string },
  ): Promise<Producto[]> {
    const since = dayjs(dates.since);
    const until = dayjs(dates.until);
    return await this.productoService.getProductosBetweenDates({ since, until });
  }

  @Get(":id")
  async getOne(@Param("id") id: string): Promise<Producto> {
    try {
      return await this.productoRepository.getOne(id);
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: "Internal Server Error" },
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  @Patch()
  async updateOne(@Body() updateProducto: Partial<Producto>): Promise<Producto> {
    try {
      return await this.productoRepository.updateOne(updateProducto);
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
    @Body() createProductDTO: ProductoCreate,
    @UploadedFile("file") file: Express.Multer.File,
  ): Promise<Producto> {
    const tmpProducto = await this.productoRepository.createOne(createProductDTO);
    console.log(tmpProducto.id);
    await this.imageRepository.createOne(file, tmpProducto.id);

    const result = await this.productoRepository.getOne(tmpProducto.id.toString());

    return result;
  }
}
