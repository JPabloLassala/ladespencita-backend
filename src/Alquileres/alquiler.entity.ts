import { Producto } from "src/Productos";

type AlquilerProducto = {
  producto: Producto | number;
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

export class Alquiler {
  id?: number;
  productora: string;
  proyecto: string;
  productos: AlquilerProducto[];
  fechaPresupuesto: Date;
  fechaAlquiler: {
    inicio: Date;
    fin: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}
