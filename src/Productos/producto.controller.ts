import { Controller, Get, Param } from '@nestjs/common';
import { ProductoRepository } from './producto.repository';

@Controller('productos')
export class ProductoController {
  constructor(private readonly productoRepository: ProductoRepository) {}

  @Get()
  async getAll() {
    return await this.productoRepository.getAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return await this.productoRepository.getOne(id);
  }
}
