import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IManager } from '../interfaces';
import { RegisterManagerDto } from '../auth/dto';
import { CommonService } from '../common/common';
import { ERole } from '../common/enums';

@Injectable()
export class ManagersService {
  constructor(
    @InjectModel('Manager') private readonly managerModel: Model<IManager>,
    private readonly commonService: CommonService,
  ) {}

  async registerManager(manager: RegisterManagerDto): Promise<string> {
    const passwordHash = await this.commonService.hashPassword(
      manager.password,
    );
    await this.managerModel.create({
      ...manager,
      password: passwordHash,
    });

    return 'User created';
  }

  async findEmail(userEmail: string) {
    return this.managerModel.findOne({
      email: userEmail,
    });
  }

  async findUsername(username: string) {
    return this.managerModel.findOne({
      username: username,
    });
  }

  // async getAllManagers(
  //   user: IManager,
  //   page: number,
  //   limit: number,
  // ): Promise<IManager[]> {
  //   if (user.role === ERole.admin) {
  //     const startIndex = (page - 1) * limit;
  //     const endIndex = page * limit;
  //
  //     return this.managerModel.find().slice(String(startIndex), endIndex);
  //
  //     // return this.managerModel.find();
  //   } else {
  //     throw new HttpException(
  //       'You don`t have permissions',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  // }
  async getAllManagers(
    user: IManager,
    page: number,
    limit: number,
  ): Promise<IManager[]> {
    if (user.role === ERole.admin) {
      const skip = (page - 1) * limit;

      return this.managerModel.find().skip(skip).limit(limit).exec();
    } else {
      throw new HttpException(
        'You don`t have permissions',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
