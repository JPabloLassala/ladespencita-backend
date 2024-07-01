import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.renameTable("producto_foto", "producto_fotos");
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.renameTable("producto_fotos", "producto_foto");
}
