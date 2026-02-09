import { Module } from "@nestjs/common";
import { AlquilerModule } from "src/alquiler";
import { ProductoModule } from "src/producto";
import { ConfigModule } from "@nestjs/config";
import { AlquilerProductoModule } from "src/alquiler-producto";
import { AuthModule } from "src/auth";
import { ImageModule } from "src/image";
import { DatabaseModule } from "src/database";
import { SheetModule } from "src/sheet";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    AlquilerModule,
    ProductoModule,
    AlquilerProductoModule,
    ImageModule,
    SheetModule,
  ],
})
export class AppModule {}
