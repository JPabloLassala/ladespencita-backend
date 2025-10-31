import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Producto } from "./producto.entity";

@Table({ tableName: "productos", timestamps: true })
export class ProductoSchema extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id?: string;
  @Column(DataType.STRING)
  nombre: string;
  @Column(DataType.INTEGER)
  unidadesMetroLineal: number;
  @Column(DataType.INTEGER)
  stock: number;

  disponibles: number;
  @Column(DataType.INTEGER)
  medidasAltura: number;
  @Column(DataType.INTEGER)
  medidasAncho?: number;
  @Column(DataType.INTEGER)
  medidasProfundidad?: number;
  @Column(DataType.INTEGER)
  medidasDiametro?: number;
  @Column(DataType.INTEGER)
  costoProducto: number;
  @Column(DataType.INTEGER)
  costoGrafica: number;
  @Column(DataType.INTEGER)
  costoDiseno: number;
  @Column(DataType.INTEGER)
  costoTotal: number;
  @Column(DataType.INTEGER)
  valorUnitarioGarantia: number;
  @Column(DataType.INTEGER)
  valorTotalGarantia: number;
  @Column(DataType.INTEGER)
  valorUnitarioAlquiler: number;
  @Column(DataType.INTEGER)
  valorX1: number;
  @Column(DataType.INTEGER)
  valorX3: number;
  @Column(DataType.INTEGER)
  valorX6: number;
  @Column(DataType.INTEGER)
  valorX12: number;
}

export interface ProductoModel {
  id?: string;
  nombre: string;
  unidadesMetroLineal: number;
  stock: number;
  disponibles: number;
  medidasAltura: number;
  medidasAncho?: number;
  medidasProfundidad?: number;
  medidasDiametro?: number;
  costoProducto: number;
  costoGrafica: number;
  costoDiseno: number;
  costoTotal: number;
  valorUnitarioGarantia: number;
  valorTotalGarantia: number;
  valorUnitarioAlquiler: number;
  valorX1: number;
  valorX3: number;
  valorX6: number;
  valorX12: number;
}

export const fromSchemaToProducto = (dto: ProductoSchema): Producto => {
  return {
    id: dto.id,
    nombre: dto.nombre,
    unidadesMetroLineal: dto.unidadesMetroLineal,
    stock: dto.stock,
    disponibles: dto.disponibles,
    medidas: {
      altura: dto.medidasAltura,
      ancho: dto.medidasAncho,
      profundidad: dto.medidasProfundidad,
      diametro: dto.medidasDiametro,
    },
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
  };
};

export const fromProductoToSchema = (producto: Producto | Partial<Producto>): ProductoSchema => {
  return new ProductoSchema({
    id: producto.id,
    nombre: producto.nombre,
    unidadesMetroLineal: producto.unidadesMetroLineal,
    stock: producto.stock,
    disponibles: producto.disponibles,
    medidasAltura: producto.medidas.altura,
    medidasAncho: producto.medidas.ancho,
    medidasProfundidad: producto.medidas.profundidad,
    medidasDiametro: producto.medidas.diametro,
    costoProducto: producto.costo.producto,
    costoGrafica: producto.costo.grafica,
    costoDiseno: producto.costo.diseno,
    costoTotal: producto.costo.total,
    valorUnitarioGarantia: producto.valor.unitarioGarantia,
    valorTotalGarantia: producto.valor.totalGarantia,
    valorUnitarioAlquiler: producto.valor.unitarioAlquiler,
    valorX1: producto.valor.x1,
    valorX3: producto.valor.x3,
    valorX6: producto.valor.x6,
    valorX12: producto.valor.x12,
  });
};
