import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';

import { ManagersService } from './managers.service';
import { JwtAuthGuard } from '../auth';
import { IManager, IRequest } from '../interfaces';

@Controller('managers')
export class ManagersController {
  constructor(private readonly managersService: ManagersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllManagers(
    @Req() req: IRequest,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<IManager[]> {
    const user = req.user;
    return await this.managersService.getAllManagers(user, page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:managerId')
  async getManagerById(
    @Req() req: IRequest,
    @Param('managerId') managerId: string,
  ): Promise<IManager> {
    const user = req.user;
    return await this.managersService.getManagerById(user, managerId);
  }
}
