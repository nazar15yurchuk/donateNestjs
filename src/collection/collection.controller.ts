import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CollectionDto } from './dto';
import { IRequest } from '../interfaces';
import { ICollection } from '../interfaces';
import { JwtAuthGuard } from '../auth/auth.guards';
import { UpdateCollectionDto } from './dto';

@Controller('collection')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createCollection(
    @Req() req: any,
    @Body() body: CollectionDto,
  ): Promise<ICollection> {
    const user = req.user;
    const userId = req.user._id;
    return await this.collectionService.createCollection(user, body, userId);
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
  @Get()
  async getAllCollections(): Promise<ICollection[]> {
    return await this.collectionService.getAllCollections();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:collectionId')
  async getCollectionById(
    @Param('collectionId') collectionId: string,
  ): Promise<ICollection> {
    return await this.collectionService.getCollectionById(collectionId);
  }
}
