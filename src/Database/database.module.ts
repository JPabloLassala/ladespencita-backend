import { DynamicModule, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AlquilerEntity } from "src/Alquiler";
import { AlquilerProductoEntity } from "src/AlquilerProducto";
import { ImageEntity } from "src/Image";
import { ProductoEntity } from "src/Producto";

export const DatabaseModule: DynamicModule = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: "postgres",
    url: configService.get("DATABASE_URL"),
    entities: [ProductoEntity, AlquilerEntity, ImageEntity, AlquilerProductoEntity],
    synchronize: true,
    retryAttempts: 3,
    retryDelay: 3000,
    logging: true,
  }),
});
