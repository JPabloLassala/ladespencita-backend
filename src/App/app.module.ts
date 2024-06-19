import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductoModule } from 'src/Productos';
import { FotoModule } from 'src/Fotos/foto.module';

@Module({
  imports: [ProductoModule, FotoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
