export type AlquilerProducto = {
  id?: string;
  productoId: string;
  costo: {
    producto: number;
    grafica: number;
    diseno: number;
    total: number;
  };
  unidadesAlquiladas: number;
  unidadesCotizadas: number;
  cantidad: number;
  valor: {
    unitarioGarantia: number;
    totalGarantia: number;
    unitarioAlquiler: number;
    x1: number;
    x3: number;
    x6: number;
    x12: number;
  };
};
