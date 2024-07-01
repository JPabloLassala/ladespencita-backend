import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ProductoRepository } from './producto.repository';
import { Producto } from './producto.entity';
import { ProductoRequestDTO } from './Product.record.dto';
import { ApiProperty, ApiResponse } from '@nestjs/swagger';

@Controller('productos')
export class ProductoController {
  constructor(private readonly productoRepository: ProductoRepository) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: Array<Producto>,
  })
  async getAll(): Promise<Producto[]> {
    return await this.productoRepository.getAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: Producto,
    example: 1,
  })
  async getOne(@Param('id') id: string): Promise<Producto> {
    return await this.productoRepository.getOne(id);
  }

  @Patch(':id')
  @ApiProperty({
    type: ProductoRequestDTO,
    example: {
      nombre: 'Producto 1',
      unidadesMetroLineal: 1,
      altura: 1,
      ancho: 1,
      profundidad: 1,
      diametro: 1,
      valorUnitarioGarantia: 1,
      costoProducto: 1,
      costoGrafica: 1,
      diseno: 1,
      costoTotal: 1,
      valorx1: 1,
      valorx3: 1,
      valorx6: 1,
      valorx12: 1,
    },
  })
  async updateOne(
    @Param('id') id: string,
    @Body() updateProductDTO: ProductoRequestDTO,
  ): Promise<Producto> {
    const partialProducto = ProductoRequestDTO.toProducto(id, updateProductDTO);
    return await this.productoRepository.updateOne(partialProducto);
  }
}
