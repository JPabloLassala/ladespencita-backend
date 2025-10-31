import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { ProductoModule } from "src/Producto";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { AlquilerModule } from "src/Alquiler/alquiler.module";
import { AlquilerProductoModule } from "src/AlquilerProducto";

const getPhotoModule = () => {
  return ServeStaticModule.forRoot({
    rootPath: join(__dirname, "..", "..", "..", "images"),
    serveRoot: "/images",
  });
};

@Module({
  imports: [ProductoModule, AlquilerModule, AlquilerProductoModule, getPhotoModule()],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
