import { Module } from '@nestjs/common';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth';
import { CollectionModule } from './collection';
import { ImagesController } from './images';

import * as dotenv from 'dotenv';
import { ManagersModule } from './managers';
dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_DB),
    ManagersModule,
    AuthModule,
    CollectionModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'donateImages'),
      serveRoot: '/images',
    }),
  ],
  controllers: [AppController, ImagesController],
  providers: [AppService],
})
export class AppModule {}
