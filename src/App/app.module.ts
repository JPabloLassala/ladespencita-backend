import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { AlquilerModule } from "src/Alquiler";
import { ProductoModule } from "src/Producto";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { AlquilerProductoModule } from "src/AlquilerProducto";
import { AuthModule } from "src/Auth";
import { ImageModule } from "src/Image";
import { DatabaseModule } from "src/Database";

const getPhotoModule = () => {
  return ServeStaticModule.forRoot({
    rootPath: join(__dirname, "../../..", "images"),
    serveRoot: "/images",
  });
};

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    AlquilerModule,
    ProductoModule,
    AlquilerProductoModule,
    ImageModule,
    getPhotoModule(),
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
