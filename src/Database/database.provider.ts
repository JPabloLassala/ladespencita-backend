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
        dialect: "postgres",
        database: "ladespensita",
        host: process.env.DB_HOST,
        port: 5432,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
      });
      sequelize.addModels([ProductoSchema, AlquilerSchema, AlquilerProductoSchema]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
