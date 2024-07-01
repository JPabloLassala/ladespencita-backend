import { ApiProperty, ApiResponse } from '@nestjs/swagger';
import { ProductoRequestDTO } from './Product.record.dto';
import { Producto } from './producto.entity';

export const UpdateOneSwaggerDoc = () =>
  ApiProperty({
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
  });

export const GetOneSwaggerDoc = () =>
  ApiResponse({
    status: 200,
    type: Producto,
    example: 1,
  });

export const GetAllSwaggerDoc = () =>
  ApiResponse({
    status: 200,
    type: Array<Producto>,
  });
