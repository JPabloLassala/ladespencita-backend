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

@Controller("productos")
export class ProductoController {
  constructor(private readonly productoRepository: ProductoRepository) {}

  @Get()
  async getAll(): Promise<Producto[]> {
    return await this.productoRepository.getAll();
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
      const partialProducto = ProductoRequestDTO.toProducto(updateProductDTO);
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
  async create(@Body() createProductDTO: Producto): Promise<Producto> {
    const partialProducto = createProductDTO;

    return await this.productoRepository.createOne(partialProducto);
  }
}
