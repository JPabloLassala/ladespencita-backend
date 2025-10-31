import { Sequelize } from "sequelize-typescript";
import { Provider } from "@nestjs/common";
import { DB_CONNECTION } from "src/constants";
import { ProductoSchema } from "src/Producto";

export const databaseProviders: Provider[] = [
  {
    provide: DB_CONNECTION,
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: "sqlite",
        database: "ladespen.sqlite",
      });
      sequelize.addModels([ProductoSchema]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
