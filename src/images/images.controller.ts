import { Controller, Get, Param, Res } from '@nestjs/common';
import { join } from 'path';
import { Response } from 'express';

@Controller('images')
export class ImagesController {
  @Get(':imageName')
  serveImage(
    @Param('imageName') imageName: string,
    @Res() res: Response,
  ): void {
    const imagePath = join(__dirname, '..', '..', 'donateImages', imageName);
    console.log(imagePath);
    try {
      res.sendFile(imagePath);
    } catch (error) {
      res.status(404).send('Image not found');
    }
  }
}
