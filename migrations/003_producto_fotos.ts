import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("productos", (table) => {
    table.dropColumn("foto");
  });
  await knex.schema.createTable("producto_foto", (table) => {
    table.increments("id").primary().notNullable();
    table.integer("producto_id").notNullable();
    table.foreign("producto_id").references("id").inTable("productos");
    table.string("path").notNullable();
    table.boolean("principal").defaultTo(false);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("producto_foto");
  await knex.schema.alterTable("productos", (table) => {
    table.string("foto").notNullable();
  });
}
