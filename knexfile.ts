import type { Knex } from "knex";

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "ladespen.sqlite",
    },
    useNullAsDefault: true,
  },
};

module.exports = config;
