import { Sequelize } from "sequelize-typescript";
import { Provider } from "@nestjs/common";
import { DB_CONNECTION } from "src/constants";
import { ProductoSchema } from "src/Producto";

export const databaseProviders: Provider[] = [
  {
    provide: DB_CONNECTION,
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: "postgres",
        database: "ladespensita",
        host: process.env.DB_HOST,
        port: 5432,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
      });
      sequelize.addModels([ProductoSchema]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
