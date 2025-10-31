import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { AlquilerModule } from "src/Alquiler/alquiler.module";
import { AlquilerProductoModule } from "src/AlquilerProducto";
import { AuthModule } from "src/Auth";
import { ProductoModule } from "src/Producto";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";

const getPhotoModule = () => {
  return ServeStaticModule.forRoot({
    rootPath: join(__dirname, "..", "..", "..", "images"),
    serveRoot: "/images",
  });
};

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    AlquilerModule,
    AlquilerProductoModule,
    ProductoModule,
    getPhotoModule(),
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
