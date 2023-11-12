import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { ManagersService } from '../managers';
import { LoginManagerDto, RegisterManagerDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IManager, Payload } from '../interfaces';
import { IToken } from '../interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly managersService: ManagersService,
    @InjectModel('Tokens') private readonly tokenModel: Model<IToken>,
  ) {}

  async registerManager(body: RegisterManagerDto): Promise<string> {
    let findEmail;
    let findUsername;
    try {
      findEmail = await this.managersService.findEmail(body.email);
      findUsername = await this.managersService.findUsername(body.username);
    } catch (e) {
      throw new Error(e.message);
    }
    if (findEmail) {
      throw new HttpException(
        'User with this email is already exists',
        HttpStatus.FORBIDDEN,
      );
    }
    if (findUsername) {
      throw new HttpException(
        'User with this username is already exists',
        HttpStatus.FORBIDDEN,
      );
    }
    await this.managersService.registerManager({
      username: body.username,
      email: body.email,
      password: body.password,
    });
    return 'User created';
  }

  async loginManager(body: LoginManagerDto) {
    const manager = await this.managersService.findEmail(body.email);
    const role = manager.role;

    if (!manager) {
      throw new HttpException(
        'Email or password is incorrect',
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (await this.compareHash(body.password, manager.password)) {
      const payload = {
        email: manager.email,
      };
      const tokens = await this.signTokens(payload, manager);

      return { tokens, role };
    }
    throw new HttpException(
      'Email or password is incorrect',
      HttpStatus.UNAUTHORIZED,
    );
  }

  async compareHash(password: string, hash: string) {
    return bcrypt.compare(password.toString(), hash);
  }

  async signTokens(payload, manager: IManager) {
    const access_token = sign(payload, 'ACCESS_SECRET', {
      expiresIn: '15m',
    });
    const refresh_token = sign(payload, 'REFRESH_TOKEN', {
      expiresIn: '7d',
    });

    await this.tokenModel.create({
      _manager_id: manager.id,
      access_token,
      refresh_token,
    });
    return { access_token, refresh_token };
  }

  async validateUser(payload: Payload) {
    return await this.managersService.findEmail(payload.email);
  }

  async refresh(manager: IManager) {
    const tokens = await this.signTokens(
      {
        id: manager._id,
        email: manager.email,
      },
      manager,
    );
    return { ...tokens };
  }
}
