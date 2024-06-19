import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/Database';
import { ProductoController } from './producto.controller';
import { ProductoRepository } from './producto.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductoController],
  providers: [ProductoRepository],
})
export class ProductoModule {}
