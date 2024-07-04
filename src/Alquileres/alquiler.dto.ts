import { ProductoRecordDTO } from "src/Productos";
import { Alquiler } from "./alquiler.entity";

export type AlquilerProductoRecordDTO = {
  id?: number;
  producto_id: number;
  alquiler_id: number;
  unidadesAlquiladas: number;
  unidadesCotizadas: number;
  cantidad: number;
  valorx1: number;
  valorx3: number;
  valorx6: number;
  valorx12: number;
  subtotalAlquiler: number;
  valorUnitarioGarantia: number;
  valorUnitarioAlquiler: number;
};

export class AlquilerRecordDTO {
  id?: number;
  productora: string;
  proyecto: string;
  fechaPresupuesto?: Date;
  fechaInicio?: Date;
  fechaFin?: Date;
  created_at?: Date;
  updated_at?: Date;

  static toAlquilerWithoutProductos = (
    dto: AlquilerRecordDTO,
    pDtos: AlquilerProductoRecordDTO[],
  ): Alquiler => {
    return {
      id: dto.id,
      productora: dto.productora,
      proyecto: dto.proyecto,
      fechaPresupuesto: dto.fechaPresupuesto,
      fechaAlquiler: {
        inicio: dto.fechaInicio,
        fin: dto.fechaFin,
      },
      productos: pDtos
        .filter((p) => p.alquiler_id === dto.id)
        .map((pDto) => ({
          producto: pDto.producto_id,
          unidadesAlquiladas: pDto.unidadesAlquiladas,
          unidadesCotizadas: pDto.unidadesCotizadas,
          cantidad: pDto.cantidad,
          valor: {
            unitarioGarantia: pDto.valorUnitarioGarantia,
            unitarioAlquiler: pDto.valorUnitarioAlquiler,
            totalGarantia: 0,
            cantidad: pDto.cantidad,
            x1: pDto.valorx1,
            x3: pDto.valorx3,
            x6: pDto.valorx6,
            x12: pDto.valorx12,
          },
        })),
      createdAt: dto.created_at,
      updatedAt: dto.updated_at,
    };
  };

  static toAlquilerWithProductos = (
    dto: AlquilerRecordDTO,
    pDtos: AlquilerProductoRecordDTO[],
    prodDtos: ProductoRecordDTO[],
  ): Alquiler => {
    return {
      id: dto.id,
      productora: dto.productora,
      proyecto: dto.proyecto,
      fechaPresupuesto: dto.fechaPresupuesto,
      fechaAlquiler: {
        inicio: dto.fechaInicio,
        fin: dto.fechaFin,
      },
      productos: pDtos
        .filter((p) => p.alquiler_id === dto.id)
        .map((pDto) => ({
          producto: ProductoRecordDTO.toProducto(prodDtos.find((p) => p.id === pDto.producto_id)),
          unidadesAlquiladas: pDto.unidadesAlquiladas,
          unidadesCotizadas: pDto.unidadesCotizadas,
          cantidad: pDto.cantidad,
          valor: {
            unitarioGarantia: pDto.valorUnitarioGarantia,
            unitarioAlquiler: pDto.valorUnitarioAlquiler,
            totalGarantia: 0,
            cantidad: pDto.cantidad,
            x1: pDto.valorx1,
            x3: pDto.valorx3,
            x6: pDto.valorx6,
            x12: pDto.valorx12,
          },
        })),
      createdAt: dto.created_at,
      updatedAt: dto.updated_at,
    };
  };
}
