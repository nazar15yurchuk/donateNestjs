import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginManagerDto, RegisterManagerDto } from './dto';
import { IRequest } from '../interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerManager(@Body() body: RegisterManagerDto): Promise<string> {
    return this.authService.registerManager(body);
  }

  @Post('login')
  async loginManager(@Body() body: LoginManagerDto) {
    return this.authService.loginManager(body);
  }
}
