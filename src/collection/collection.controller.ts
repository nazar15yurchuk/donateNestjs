import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
// import { diskStorage } from 'multer';
// import { extname } from 'path';
// import { FileInterceptor } from '@nestjs/platform-express/multer';
import { FileInterceptor } from '@nestjs/platform-express';

import { CollectionService } from './collection.service';
import { CollectionDto } from './dto';
import { IRequest } from '../interfaces';
import { ICollection } from '../interfaces';
import { JwtAuthGuard } from '../auth';
import { UpdateCollectionDto } from './dto';
import { EStatus } from '../common';
import { UpdateCollectionByManagerDto } from './dto';

@Controller('collection')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  // @UseInterceptors(
  //   FileInterceptor('image', {
  //     storage: diskStorage({
  //       destination: './donateImages',
  //       filename: (req, file, callback) => {
  //         const randomName = Array(32)
  //           .fill(null)
  //           .map(() => Math.round(Math.random() * 16).toString(16))
  //           .join('');
  //         return callback(null, `${randomName}${extname(file.originalname)}`);
  //       },
  //     }),
  //   }),
  // )
  @UseInterceptors(FileInterceptor('image'))
  async createCollection(
    @Req() req: any,
    @Body() body: CollectionDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const user = req.user;
    const userId = req.user._id;
    if (body.sum && Number(body.sum) < 1) {
      throw new HttpException(
        { message: 'Sum must be at least 0' },
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.collectionService.createCollection(
      user,
      body,
      userId,
      file,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put('update/:collectionId')
  async updateCollection(
    @Req() req: IRequest,
    @Body() body: UpdateCollectionDto,
    @Param('collectionId') collectionId: string,
  ): Promise<string> {
    const user = req.user;
    return await this.collectionService.updateCollection(
      user,
      body,
      collectionId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put('updateOne/:collectionId')
  async updateCollectionByManager(
    @Req() req: IRequest,
    @Body() body: UpdateCollectionByManagerDto,
    @Param('collectionId') collectionId: string,
  ) {
    const user = req.user;
    return await this.collectionService.updateCollectionByManager(
      user,
      body,
      collectionId,
    );
  }

  @Get()
  async getAllCollections(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<ICollection[]> {
    return await this.collectionService.getAllCollections(page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Get('pending')
  async getAllPendingCollections(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Req() req: IRequest,
  ): Promise<ICollection[]> {
    const user = req.user;
    return await this.collectionService.getAllPendingCollections(
      page,
      limit,
      user,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:collectionId')
  async getCollectionById(
    @Param('collectionId') collectionId: string,
  ): Promise<ICollection> {
    return await this.collectionService.getCollectionById(collectionId);
  }

  @Get('search/:title')
  async searchCollections(
    @Param('title') title: string,
  ): Promise<ICollection[]> {
    return this.collectionService.searchCollections(title);
  }

  @Get('filtered/:status')
  async filteredStatus(
    @Param('status') status: EStatus,
  ): Promise<ICollection[]> {
    return await this.collectionService.filteredStatus(status);
  }
}
