import "reflect-metadata";
import { DataSource } from "typeorm";
import { createDataSourceOptions } from "src/database/database.config";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required for TypeORM migrations");
}

const AppDataSource = new DataSource({
  ...createDataSourceOptions(databaseUrl),
});

export default AppDataSource;
