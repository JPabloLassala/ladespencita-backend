import { Module } from "@nestjs/common";
import { AlquilerModule } from "src/Alquiler";
import { ProductoModule } from "src/Producto";
import { ConfigModule } from "@nestjs/config";
import { AlquilerProductoModule } from "src/AlquilerProducto";
import { AuthModule } from "src/Auth";
import { ImageModule } from "src/Image";
import { DatabaseModule } from "src/Database";
import { SheetsModule } from "src/Sheet";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    AlquilerModule,
    ProductoModule,
    AlquilerProductoModule,
    ImageModule,
    SheetsModule,
  ],
})
export class AppModule {}
