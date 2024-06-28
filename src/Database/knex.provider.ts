import { Injectable } from '@nestjs/common';
import { Knex, knex } from 'knex';

@Injectable()
export class KnexProvider {
  private instance: Knex;

  constructor() {
    if (!this.instance) {
      this.instance = knex({
        client: 'sqlite3',
        connection: {
          filename: './ladespen.sqlite',
        },
      });
    }
  }

  getInstance(): Knex {
    return this.instance;
  }
}
