import { Body, Controller, Get, Param, Patch } from "@nestjs/common";
import { ProductoRepository } from "./producto.repository";
import { Producto } from "./producto.entity";
import { ProductoRequestDTO } from "./Product.record.dto";
import {
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
    return await this.productoRepository.getOne(id);
  }

  @Patch(":id")
  @UpdateOneSwaggerDoc()
  async updateOne(
    @Param("id") id: string,
    @Body() updateProductDTO: ProductoRequestDTO,
  ): Promise<Producto> {
    const partialProducto = ProductoRequestDTO.toProducto(id, updateProductDTO);
    return await this.productoRepository.updateOne(partialProducto);
  }
}
