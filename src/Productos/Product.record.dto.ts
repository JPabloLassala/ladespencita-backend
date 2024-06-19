import { Producto } from './producto.entity';

export type ProductoRecordDTO = {
  id?: number;
  nombre: string;
  unidadesMetroLineal: number;
  altura: number;
  ancho?: number;
  profundidad?: number;
  diametro?: number;
  valorUnitarioGarantia: number;
  costoProducto: number;
  costoGrafica: number;
  diseno: number;
  costoTotal: number;
  valorx1: number;
  valorx3: number;
  valorx6: number;
  valorx12: number;
};

export const getProductoFromDTO = (dto: ProductoRecordDTO): Producto => ({
  id: dto.id,
  nombre: dto.nombre,
  unidadesMetroLineal: dto.unidadesMetroLineal,
  medidas: {
    altura: dto.altura,
    ancho: dto.ancho,
    profundidad: dto.profundidad,
    diametro: dto.diametro,
  },
  valor: {
    unitarioGarantia: dto.valorUnitarioGarantia,
    x1: dto.valorx1,
    x3: dto.valorx3,
    x6: dto.valorx6,
    x12: dto.valorx12,
  },
  costo: {
    producto: dto.costoProducto,
    grafica: dto.costoGrafica,
    diseno: dto.diseno,
    total: dto.costoTotal,
  },
});
