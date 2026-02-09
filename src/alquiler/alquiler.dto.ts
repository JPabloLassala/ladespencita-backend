export interface AlquilerProductoDto {
  id: number;
  productora: string;
  proyecto: string;
  fechaPresupuesto: Date;
  fechaInicio: Date;
  fechaFin: Date;
  productos: {
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
  }[];
  createdAt: Date;
  updatedAt: Date;
}
