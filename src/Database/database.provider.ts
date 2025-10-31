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
      const sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: "postgres",
      });
      sequelize.addModels([ProductoSchema, AlquilerSchema, AlquilerProductoSchema]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
