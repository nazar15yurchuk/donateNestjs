import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { CollectionService } from './collection.service';
import { CollectionDto } from './dto';
import { IRequest } from '../interfaces';
import { ICollection } from '../interfaces';
import { JwtAuthGuard } from '../auth/auth.guards';
import { UpdateCollectionDto } from './dto';
import { EStatus } from '../common/enums';

@Controller('collection')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './donateImages',
        filename: (req, file, callback) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return callback(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async createCollection(
    @Req() req: any,
    @Body() body: CollectionDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ICollection> {
    const user = req.user;
    const userId = req.user._id;
    return await this.collectionService.createCollection(
      user,
      body,
      userId,
      file,
    );
  }

  @Post('getCollection')
  async getCollection(): Promise<ICollection[]> {
    return await this.collectionService.get();
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
  async getAllCollections(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<ICollection[]> {
    return await this.collectionService.getAllCollections(page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:collectionId')
  async getCollectionById(
    @Param('collectionId') collectionId: string,
  ): Promise<ICollection> {
    return await this.collectionService.getCollectionById(collectionId);
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('myCollections')
  // async getMyCollections(@Req() req: IRequest): Promise<ICollection[]> {
  //   const users = req.user;
  //   console.log(users);
  //   return await this.collectionService.getMyCollections(users);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Get('filtered')
  // async getFilteredCollections(): Promise<ICollection[]> {
  //   return this.collectionService.getFilteredCollections();
  // }

  @Get('filtered/:status')
  async filteredStatus(
    @Param('status') status: EStatus,
  ): Promise<ICollection[]> {
    return await this.collectionService.filteredStatus(status);
  }

  // @Get('filteredByDate')
  // async filteredDate(
  //   @Query('startDate') startDate: string,
  //   @Query('endDate') endDate: string,
  // ): Promise<ICollection[]> {
  //   const parsedStartDate = new Date(startDate).toISOString().split('T')[0];
  //   const parsedEndDate = new Date(endDate).toISOString().split('T')[0];
  //   return await this.collectionService.filteredDate(
  //     parsedStartDate,
  //     parsedEndDate,
  //   );
  // }
}
