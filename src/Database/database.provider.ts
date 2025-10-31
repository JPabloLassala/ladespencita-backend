import { Provider } from "@nestjs/common";
import { DB_CONNECTION } from "src/constants";
import { DataSource } from "typeorm";

export const databaseProvider: Provider = {
  provide: DB_CONNECTION,
  useFactory: async () => {
    const dataSource = new DataSource({
      url: process.env.DATABASE_URL,
      type: "postgres",
      synchronize: false,
      logging: true,
      entities: [__dirname + "../**/*.entity{.ts,.js}"],
    });

    return dataSource.initialize();
  },
};
