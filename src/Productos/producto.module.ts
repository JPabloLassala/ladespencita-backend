import { Module } from '@nestjs/common';

import { ProductoController } from './producto.controller';
import { ProductoRepository } from './producto.repository';
import { DatabaseModule } from 'src/Database';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductoController],
  providers: [ProductoRepository],
})
export class ProductoModule {}
