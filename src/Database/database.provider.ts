import { Sequelize } from "sequelize-typescript";
import { Provider } from "@nestjs/common";
import { DB_CONNECTION } from "src/constants";
import { ProductoSchema } from "src/Producto";
import { AlquilerSchema } from "src/Alquiler";
import { AlquilerProductoSchema } from "src/AlquilerProducto";

export const databaseProviders: Provider[] = [
  {
    provide: DB_CONNECTION,
    useFactory: async () => {
      console.log(process.env.DB_HOST);
      const sequelize = new Sequelize({
        dialect: "sqlite",
        database: "ladespensita.sqlite",
      });
      sequelize.addModels([ProductoSchema, AlquilerSchema, AlquilerProductoSchema]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
