import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("alquileres", (table) => {
    table.increments("id").primary().notNullable();
    table.string("productora").notNullable();
    table.string("proyecto").notNullable();
    table.timestamp("fechaPresupuesto").nullable();
    table.timestamp("fechaInicio").nullable();
    table.timestamp("fechaFin").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").nullable();
  });

  await knex.schema.createTable("alquileres_productos", (table) => {
    table.increments("id").primary().notNullable();
    table.integer("alquiler_id").notNullable();
    table.foreign("alquiler_id").references("id").inTable("alquileres");
    table.integer("producto_id").notNullable();
    table.foreign("producto_id").references("id").inTable("productos");
    table.integer("valorx1").nullable();
    table.integer("valorx3").nullable();
    table.integer("valorx6").nullable();
    table.integer("valorx12").nullable();
    table.integer("cantidad").notNullable();
    table.integer("valorUnitarioGarantia").nullable();
    table.integer("valorUnitarioAlquiler").nullable();
    table.integer("subtotalAlquiler").nullable();
    table.integer("unidadesCotizadas").nullable();
    table.integer("unidadesAlquiladas").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("alquileres");
}
