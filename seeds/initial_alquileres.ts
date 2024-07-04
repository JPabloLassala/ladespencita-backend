import { Knex } from "knex";
import { AlquilerProductoRecordDTO, AlquilerRecordDTO } from "src/Alquileres/alquiler.dto";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("alquileres").del();

  const alquiler1: AlquilerRecordDTO = {
    productora: "Productora 1",
    proyecto: "Proyecto 1",
    fechaPresupuesto: new Date(),
    fechaInicio: new Date(),
    fechaFin: new Date(),
  };
  const productosAlquiler1 = new Array(10)
    .fill(undefined)
    .map<AlquilerProductoRecordDTO>((_, i) => ({
      cantidad: 1,
      alquiler_id: 1,
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
    }));

  const alquiler2: AlquilerRecordDTO = {
    productora: "Productora 2",
    proyecto: "Proyecto 2",
    fechaPresupuesto: new Date(),
    fechaInicio: new Date(),
    fechaFin: new Date(),
  };
  const productosAlquiler2 = new Array(3)
    .fill(undefined)
    .map<AlquilerProductoRecordDTO>((_, i) => ({
      alquiler_id: 2,
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
    }));

  const alquiler3: AlquilerRecordDTO = {
    productora: "Productora 3",
    proyecto: "Proyecto 3",
    fechaPresupuesto: new Date(),
    fechaInicio: new Date(),
    fechaFin: new Date(),
  };
  const productosAlquiler3 = new Array(6)
    .fill(undefined)
    .map<AlquilerProductoRecordDTO>((_, i) => ({
      alquiler_id: 3,
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
    }));

  // Inserts seed entries
  await knex<AlquilerRecordDTO>("alquileres").insert([alquiler1, alquiler2, alquiler3]);
  await knex<AlquilerProductoRecordDTO>("alquileres_productos").insert([
    ...productosAlquiler1,
    ...productosAlquiler2,
    ...productosAlquiler3,
  ]);
}
