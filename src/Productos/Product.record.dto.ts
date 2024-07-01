import { ApiProperty } from "@nestjs/swagger";
import { Producto } from "./producto.entity";

export class ProductoRequestDTO {
  @ApiProperty({ name: "asdasda", example: "Producto 1", required: false })
  @ApiProperty({ example: "Producto 1", required: false })
  nombre?: string;
  @ApiProperty({ example: 1, required: false })
  unidadesMetroLineal?: number;
  @ApiProperty({ example: 1, required: false })
  altura?: number;
  @ApiProperty({ example: 1, required: false })
  ancho?: number;
  @ApiProperty({ example: 1, required: false })
  profundidad?: number;
  @ApiProperty({ example: 1, required: false })
  diametro?: number;
  @ApiProperty({ example: 1, required: false })
  valorUnitarioGarantia?: number;
  @ApiProperty({ example: 1, required: false })
  costoProducto?: number;
  @ApiProperty({ example: 1, required: false })
  costoGrafica?: number;
  @ApiProperty({ example: 1, required: false })
  diseno?: number;
  @ApiProperty({ example: 1, required: false })
  costoTotal?: number;
  @ApiProperty({ example: 1, required: false })
  valorx1?: number;
  @ApiProperty({ example: 1, required: false })
  valorx3?: number;
  @ApiProperty({ example: 1, required: false })
  valorx6?: number;
  @ApiProperty({ example: 1, required: false })
  valorx12?: number;

  static toProducto = (
    dto: ProductoRequestDTO,
    id?: string,
  ): Partial<Producto> => ({
    id: id ? parseInt(id) : undefined,
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
}

export class ProductoRecordDTO {
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

  static toProducto = (dto: ProductoRecordDTO): Producto => ({
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

  static fromProducto = (
    producto: Partial<Producto>,
  ): Partial<ProductoRecordDTO> => ({
    id: producto.id,
    nombre: producto.nombre ?? undefined,
    unidadesMetroLineal: producto.unidadesMetroLineal ?? undefined,
    altura: producto?.medidas?.altura ?? undefined,
    ancho: producto?.medidas?.ancho ?? undefined,
    profundidad: producto?.medidas?.profundidad ?? undefined,
    diametro: producto?.medidas?.diametro ?? undefined,
    valorUnitarioGarantia: producto?.valor?.unitarioGarantia ?? undefined,
    costoProducto: producto?.costo?.producto ?? undefined,
    costoGrafica: producto?.costo?.grafica ?? undefined,
    diseno: producto?.costo?.diseno ?? undefined,
    costoTotal: producto?.costo?.total ?? undefined,
    valorx1: producto?.valor?.x1 ?? undefined,
    valorx3: producto?.valor?.x3 ?? undefined,
    valorx6: producto?.valor?.x6 ?? undefined,
    valorx12: producto?.valor?.x12 ?? undefined,
  });
}
