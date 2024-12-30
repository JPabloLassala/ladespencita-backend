import { Module } from "@nestjs/common";
import { ImagenProductoService } from "./ImagenProducto.service";
import { ImagenProductoRepository } from "./ImagenProducto.repository";
import { ImagenProductoController } from "./ImagenProducto.controller";

@Module({
  controllers: [ImagenProductoController],
  providers: [ImagenProductoService, ImagenProductoRepository],
  exports: [],
})
export class ImagenProductoModule {}
