import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { AlquilerEntity } from "src/modules/alquiler/alquiler.entity";
import { AlquilerProductoEntity } from "src/modules/alquiler-producto/alquiler-producto.entity";
import { ImageEntity } from "src/modules/image/image.entity";
import { ProductoEntity } from "src/modules/producto/producto.entity";
import { DataSourceOptions } from "typeorm";

export const DATABASE_MIGRATIONS = ["src/Database/migrations/**/*.ts"];

export function createDataSourceOptions(databaseUrl: string): DataSourceOptions {
  return {
    type: "postgres",
    url: databaseUrl,
    entities: [AlquilerEntity, ProductoEntity, AlquilerProductoEntity, ImageEntity],
    migrations: DATABASE_MIGRATIONS,
    synchronize: false,
    logging: false,
  };
}

export function createNestTypeOrmOptions(databaseUrl: string): TypeOrmModuleOptions {
  return {
    ...createDataSourceOptions(databaseUrl),
    synchronize: false,
    retryAttempts: 3,
    retryDelay: 3000,
  };
}
