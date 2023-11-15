import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ManagersService } from './managers.service';
import { ManagersController } from './managers.controller';
import { ManagerSchema } from '../schemas';
import { CommonService } from '../common';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Manager', schema: ManagerSchema }]),
  ],
  providers: [ManagersService, CommonService],
  controllers: [ManagersController],
  exports: [ManagersModule, ManagersService],
})
export class ManagersModule {}
