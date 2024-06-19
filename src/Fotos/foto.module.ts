import { Module } from '@nestjs/common';
import { FotoController } from './foto.controller';
import { FotoRepository } from './foto.repository';
import { DatabaseModule } from 'src/Database';

@Module({
  imports: [DatabaseModule],
  controllers: [FotoController],
  providers: [FotoRepository],
  exports: [],
})
export class FotoModule {}
