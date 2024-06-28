import { Module } from '@nestjs/common';
import { KnexProvider } from './knex.provider';
import { KNEX_INSTANCE } from 'src/constants/database';

const knexInstanceProvider = {
  provide: KNEX_INSTANCE,
  useFactory: async (knexProvider: KnexProvider) => {
    return knexProvider.getInstance();
  },
  inject: [KnexProvider],
};

@Module({
  imports: [],
  providers: [KnexProvider, knexInstanceProvider],
  exports: [knexInstanceProvider],
})
export class DatabaseModule {}
