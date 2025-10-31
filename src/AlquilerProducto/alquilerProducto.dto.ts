import { AlquilerProducto, CreateAlquilerProducto } from "./alquilerProducto.entity";

export interface AlquilerProductoDto {
  id: number;
  productoId: number;
  alquilerId: number;
  costoProducto: number;
  costoGrafica: number;
  costoDiseno: number;
  costoTotal: number;
  unidadesAlquiladas: number;
  unidadesCotizadas: number;
  cantidad: number;
  valorUnitarioGarantia: number;
  valorTotalGarantia: number;
  valorUnitarioAlquiler: number;
  valorX1: number;
  valorX3: number;
  valorX6: number;
  valorX12: number;
}

export type CreateAlquilerProductoDto = Omit<AlquilerProductoDto, "id">;

export const fromDtoToAlquilerProducto = (
  dto: AlquilerProductoDto | CreateAlquilerProductoDto,
): AlquilerProducto | CreateAlquilerProducto => ({
  id: (dto as AlquilerProductoDto)?.id || undefined,
  productoId: dto.productoId,
  alquilerId: dto.alquilerId,
  costo: {
    producto: dto.costoProducto,
    grafica: dto.costoGrafica,
    diseno: dto.costoDiseno,
    total: dto.costoTotal,
  },
  valor: {
    unitarioGarantia: dto.valorUnitarioGarantia,
    totalGarantia: dto.valorTotalGarantia,
    unitarioAlquiler: dto.valorUnitarioAlquiler,
    x1: dto.valorX1,
    x3: dto.valorX3,
    x6: dto.valorX6,
    x12: dto.valorX12,
  },
  unidadesAlquiladas: dto.unidadesAlquiladas,
  unidadesCotizadas: dto.unidadesCotizadas,
  cantidad: dto.cantidad,
});
