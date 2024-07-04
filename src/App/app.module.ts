import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { ProductoModule } from "src/Productos";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { AlquilerModule } from "src/Alquileres/alquiler.module";

const getPhotoModule = () => {
  return ServeStaticModule.forRoot({
    rootPath: join(__dirname, "..", "..", "..", "images"),
    serveRoot: "/images",
  });
};

@Module({
  imports: [ProductoModule, AlquilerModule, getPhotoModule()],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
