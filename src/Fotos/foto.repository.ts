import { Inject, Injectable } from '@nestjs/common';
import { ReadStream, createReadStream } from 'fs';
import { Knex } from 'knex';
import { join } from 'path';
import { KNEX_INSTANCE } from 'src/constants/database';

@Injectable()
export class FotoRepository {
  constructor(@Inject(KNEX_INSTANCE) private readonly knex: Knex) {}

  async get(id: string): Promise<ReadStream> {
    const result = await this.knex('producto_fotos')
      .select('*')
      .where('id', id)
      .limit(1)
      .first();

    const imagePath = join(
      __dirname,
      '..',
      '..',
      '..',
      'assets',
      'images',
      result.path,
    );
    const fotoFile = createReadStream(imagePath);

    return fotoFile;
  }
}
