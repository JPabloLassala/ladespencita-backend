import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('producto', (table) => {
    table.increments('id').primary().notNullable();
    table.string('nombre').notNullable();
    table.binary('foto').nullable();
    table.integer('unidadesMetroLineal').nullable();
    table.integer('altura').nullable();
    table.integer('ancho').nullable();
    table.integer('profundidad').nullable();
    table.integer('diametro').nullable();
    table.integer('valorUnitarioGarantia').nullable();
    table.integer('costoProducto').nullable();
    table.integer('costoGrafica').nullable();
    table.integer('diseno').nullable();
    table.integer('costoTotal').nullable();
    table.integer('valorx1').nullable();
    table.integer('valorx3').nullable();
    table.integer('valorx6').nullable();
    table.integer('valorx12').nullable();
    table.json('etiquetas');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('producto');
}
