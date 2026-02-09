import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { AlquilerEntity } from "src/alquiler";
import { AlquilerProductoEntity } from "src/alquiler-producto";
import { ImageEntity } from "src/image";
import { ProductoEntity } from "src/producto";
import { DataSourceOptions } from "typeorm";

export const DATABASE_ENTITIES = [
  ProductoEntity,
  AlquilerEntity,
  ImageEntity,
  AlquilerProductoEntity,
];

export const DATABASE_MIGRATIONS = ["src/Database/migrations/**/*.ts"];

export function createDataSourceOptions(databaseUrl: string): DataSourceOptions {
  return {
    type: "postgres",
    url: databaseUrl,
    entities: DATABASE_ENTITIES,
    migrations: DATABASE_MIGRATIONS,
    synchronize: false,
    logging: false,
  };
}

export function createNestTypeOrmOptions(databaseUrl: string): TypeOrmModuleOptions {
  return {
    ...createDataSourceOptions(databaseUrl),
    synchronize: true,
    retryAttempts: 3,
    retryDelay: 3000,
  };
}
