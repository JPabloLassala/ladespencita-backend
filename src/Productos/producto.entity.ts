export class Producto {
  id?: number;
  nombre: string;
  unidadesMetroLineal: number;
  medidas: {
    altura: number;
    ancho?: number;
    profundidad?: number;
    diametro?: number;
  };
  costo: {
    producto: number;
    grafica: number;
    diseno: number;
    total: number;
  };
  valor: {
    unitarioGarantia: number;
    x1: number;
    x3: number;
    x6: number;
    x12: number;
  };
}
