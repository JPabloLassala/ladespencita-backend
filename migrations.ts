import "reflect-metadata";
import { createDataSourceOptions } from "src/infrastructure/database";
import { DataSource } from "typeorm";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required for TypeORM migrations");
}

const AppDataSource = new DataSource({
  ...createDataSourceOptions(databaseUrl),
});

export default AppDataSource;
