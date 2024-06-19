import { Controller, Get, Param, Res } from '@nestjs/common';
import { FotoRepository } from './foto.repository';
import type { Response } from 'express';

@Controller('fotos')
export class FotoController {
  constructor(private readonly fotoRepository: FotoRepository) {}

  @Get(':id')
  async getFoto(@Param('id') id: string, @Res() res: Response) {
    const image = await this.fotoRepository.get(id);

    image.pipe(res);
  }
}
