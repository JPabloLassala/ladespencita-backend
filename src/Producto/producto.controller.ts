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
import { ImageService } from "src/Image/image.service";

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
  async getOne(@Param("id") id: string): Promise<ProductoEntity> {
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
    @UploadedFile() file: Express.Multer.File,
    @Param("id") id: number,
  ): Promise<ProductoEntity> {
    try {
      console.log(file);
      if (file) {
        await this.imageService.deleteManyFromProducto(id);
        await this.imageService.createOne(file, +id);
      }
      return await this.productoAdapter.updateOne(updateProductDTO);
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
    @Body() createProductoDTO: ProductoCreateDTO,
    @UploadedFile("file") file: Express.Multer.File,
  ): Promise<ProductoEntity> {
    const tmpProducto = await this.productoService.createOne(createProductoDTO);

    await this.imageService.createOne(file, tmpProducto.id);
    return await this.productoAdapter.getOne(tmpProducto.id.toString());
  }

  @Delete(":id")
  async deleteOne(@Param("id") id: number): Promise<void> {
    await this.productoAdapter.deleteOne(id);
  }
}
