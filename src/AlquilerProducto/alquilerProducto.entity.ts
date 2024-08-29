import { Alquiler } from "src/Alquiler";
import { Producto } from "src/Producto";

export type AlquilerProducto = {
  id?: number;
  alquiler: Alquiler;
  producto: Producto;
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
