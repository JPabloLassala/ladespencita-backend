export class Alquiler {
  id?: string;
  productora: string;
  proyecto: string;
  fechaPresupuesto: Date;
  fechaAlquiler: {
    inicio: Date;
    fin: Date;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
