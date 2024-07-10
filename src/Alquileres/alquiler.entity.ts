import { Producto } from "src/Productos";

export type AlquilerProducto = {
  id?: string;
  producto: Producto;
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
  id?: string;
  productora: string;
  proyecto: string;
  productos: AlquilerProducto[];
  fechaPresupuesto: Date;
  fechaAlquiler: {
    inicio: Date;
    fin: Date;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
