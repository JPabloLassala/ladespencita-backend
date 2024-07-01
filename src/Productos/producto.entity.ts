import { ApiProperty } from "@nestjs/swagger";

export class Producto {
  @ApiProperty({ type: "number" })
  id?: number;
  @ApiProperty({ type: "string" })
  nombre: string;
  @ApiProperty({ type: "number" })
  unidadesMetroLineal: number;
  @ApiProperty({
    type: "object",
    properties: {
      altura: { type: "number" },
      ancho: { type: "number" },
      profundidad: { type: "number" },
      diametro: { type: "number" },
    },
  })
  medidas: {
    altura: number;
    ancho?: number;
    profundidad?: number;
    diametro?: number;
  };
  @ApiProperty({
    type: "object",
    properties: {
      producto: { type: "number" },
      grafica: { type: "number" },
      diseno: { type: "number" },
      total: { type: "number" },
    },
  })
  costo: {
    producto: number;
    grafica: number;
    diseno: number;
    total: number;
  };
  @ApiProperty({
    type: "object",
    properties: {
      unitarioGarantia: { type: "number" },
      x1: { type: "number" },
      x3: { type: "number" },
      x6: { type: "number" },
      x12: { type: "number" },
    },
  })
  valor: {
    unitarioGarantia: number;
    x1: number;
    x3: number;
    x6: number;
    x12: number;
  };
}
