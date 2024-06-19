import { Injectable } from '@nestjs/common';
import { ReadStream, createReadStream } from 'fs';
import { join } from 'path';
import { KnexProvider } from 'src/Database';

@Injectable()
export class FotoRepository {
  constructor(private readonly knexProvider: KnexProvider) {}

  async get(id: string): Promise<ReadStream> {
    const knex = this.knexProvider.getInstance();
    const result = await knex('producto_fotos')
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
