import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ProductoRepository } from "./producto.repository";
import { Producto } from "./producto.entity";
import { ProductoRequestDTO } from "./producto.dto";
import {
  CreateSwaggerDoc,
  GetAllSwaggerDoc,
  GetOneSwaggerDoc,
  UpdateOneSwaggerDoc,
} from "./producto.swagger";

@Controller("productos")
export class ProductoController {
  constructor(private readonly productoRepository: ProductoRepository) {}

  @Get()
  @GetAllSwaggerDoc()
  async getAll(): Promise<Producto[]> {
    return await this.productoRepository.getAll();
  }

  @Get(":id")
  @GetOneSwaggerDoc()
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

  @Patch(":id")
  @UpdateOneSwaggerDoc()
  async updateOne(
    @Param("id") id: string,
    @Body() updateProductDTO: ProductoRequestDTO,
  ): Promise<Producto> {
    try {
      const partialProducto = ProductoRequestDTO.toProducto(updateProductDTO, id);
      return await this.productoRepository.updateOne(partialProducto);
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.NOT_MODIFIED, error: "Internal Server Error" },
        HttpStatus.NOT_MODIFIED,
        { cause: error },
      );
    }
  }

  @Post()
  @CreateSwaggerDoc()
  async create(@Body() createProductDTO: ProductoRequestDTO): Promise<Producto> {
    const partialProducto = ProductoRequestDTO.toProducto(createProductDTO, undefined);
    return await this.productoRepository.createOne(partialProducto);
  }
}
