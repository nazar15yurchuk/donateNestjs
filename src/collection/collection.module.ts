import { Module } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CollectionController } from './collection.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CollectionSchema } from '../schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Collection', schema: CollectionSchema },
    ]),
  ],
  providers: [CollectionService],
  controllers: [CollectionController],
})
export class CollectionModule {}
