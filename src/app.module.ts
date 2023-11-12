import { Module } from '@nestjs/common';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ManagersModule } from './managers';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CollectionModule } from './collection/collection.module';

import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://hackathon:1iEZLQ6pEuJqQXRA@cluster0.ppv5oqb.mongodb.net/hackathonIncora?retryWrites=true&w=majority',
    ),
    ManagersModule,
    AuthModule,
    CollectionModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'donateImages'), // Adjust the path based on your project structure
      serveRoot: '/images',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
