import { Module } from '@nestjs/common';
import { KnexProvider } from './knex.provider';

@Module({
  imports: [],
  providers: [KnexProvider],
  exports: [KnexProvider],
})
export class DatabaseModule {}
