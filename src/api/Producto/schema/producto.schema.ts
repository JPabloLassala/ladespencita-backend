import { WriteRequest } from "@aws-sdk/client-dynamodb";
import { Producto } from "../model";

export class ProductoSchema {
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
  return {
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
  };
};

export const fromSchemaToDynamoDbCommand = (producto: ProductoSchema): WriteRequest => {
  return {
    PutRequest: {
      Item: {
        id: { N: producto.id },
        nombre: { S: producto.nombre },
        unidadesMetroLineal: { N: producto.unidadesMetroLineal.toString() },
        stock: { N: producto.stock.toString() },
        disponibles: { N: producto.disponibles.toString() },
        medidasAltura: { N: producto.medidasAltura.toString() },
        medidasAncho: { N: producto.medidasAncho.toString() },
        medidasProfundidad: { N: producto.medidasProfundidad.toString() },
        medidasDiametro: { N: producto.medidasDiametro.toString() },
        costoProducto: { N: producto.costoProducto.toString() },
        costoGrafica: { N: producto.costoGrafica.toString() },
        costoDiseno: { N: producto.costoDiseno.toString() },
        costoTotal: { N: producto.costoTotal.toString() },
        valorUnitarioGarantia: { N: producto.valorUnitarioGarantia.toString() },
        valorTotalGarantia: { N: producto.valorTotalGarantia.toString() },
        valorUnitarioAlquiler: { N: producto.valorUnitarioAlquiler.toString() },
        valorX1: { N: producto.valorX1.toString() },
        valorX3: { N: producto.valorX3.toString() },
        valorX6: { N: producto.valorX6.toString() },
        valorX12: { N: producto.valorX12.toString() },
      },
    },
  };
};
