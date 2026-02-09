import { Module } from "@nestjs/common";
import { AlquilerModule } from "src/modules/alquiler";
import { ProductoModule } from "src/modules/producto";
import { ConfigModule } from "@nestjs/config";
import { AlquilerProductoModule } from "src/modules/alquiler-producto";
import { AuthModule } from "src/auth";
import { ImageModule } from "src/modules/image";
import { SheetModule } from "src/modules/sheet";
import { DatabaseModule } from "src/infrastructure/database";

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
