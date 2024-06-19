import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('alquiler', (table) => {
    table.increments('id').primary().notNullable();
    table.string('productora').notNullable();
    table.string('proyecto').notNullable();
    table.integer('producto_id').notNullable();
    table.foreign('producto_id').references('id').inTable('producto');
    table.integer('unidadesCotizadas').nullable();
    table.integer('unidadesAlquiladas').nullable();
    table.integer('valorUnitarioGarantia').nullable();
    table.integer('valorUnitarioAlquiler').nullable();
    table.integer('subtotalAlquiler').nullable();
    table.integer('valorx1').nullable();
    table.integer('valorx3').nullable();
    table.integer('valorx6').nullable();
    table.integer('valorx12').nullable();
    table.timestamp('fechaInicio').nullable();
    table.timestamp('fechaFin').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('alquiler');
}
