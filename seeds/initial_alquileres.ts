import { Knex } from "knex";
import { AlquilerRecordDTO } from "src/Alquileres/alquiler.dto";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("alquileres").del();

  const alquiler1 = new Array(10).fill(undefined).map((_, i) => ({
    productora: "Productora 1",
    proyecto: "Proyecto 1",
    cantidad: 1,
    producto_id: i + 1,
    unidadesCotizadas: 1,
    unidadesAlquiladas: 1,
    valorUnitarioGarantia: 1000,
    valorUnitarioAlquiler: 100,
    subtotalAlquiler: 100,
    valorx1: 100,
    valorx3: 100,
    valorx6: 100,
    valorx12: 100,
    fechaPresupuesto: new Date(),
    fechaInicio: new Date(),
    fechaFin: new Date(),
  }));
  const alquiler2 = new Array(3).fill(undefined).map((_, i) => ({
    productora: "Productora 2",
    proyecto: "Proyecto 2",
    cantidad: 1,
    producto_id: i + 1,
    unidadesCotizadas: 1,
    unidadesAlquiladas: 1,
    valorUnitarioGarantia: 1000,
    valorUnitarioAlquiler: 100,
    subtotalAlquiler: 100,
    valorx1: 100,
    valorx3: 100,
    valorx6: 100,
    valorx12: 100,
    fechaPresupuesto: new Date(),
    fechaInicio: new Date(),
    fechaFin: new Date(),
  }));
  const alquiler3 = new Array(6).fill(undefined).map((_, i) => ({
    productora: "Productora 3",
    proyecto: "Proyecto 3",
    cantidad: 1,
    producto_id: i + 1,
    unidadesCotizadas: 1,
    unidadesAlquiladas: 1,
    valorUnitarioGarantia: 1000,
    valorUnitarioAlquiler: 100,
    subtotalAlquiler: 100,
    valorx1: 100,
    valorx3: 100,
    valorx6: 100,
    valorx12: 100,
    fechaPresupuesto: new Date(),
    fechaInicio: new Date(),
    fechaFin: new Date(),
  }));

  // Inserts seed entries
  await knex<Omit<AlquilerRecordDTO, "productos"> & { producto_id: number }>("alquileres").insert([
    ...alquiler1,
    ...alquiler2,
    ...alquiler3,
  ]);
}
