import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenSchema } from '../schemas';
import { AccessTokenStrategy } from './strategies';
import { RefreshTokenStrategy } from './strategies';
import { ManagersModule } from '../managers';

@Module({
  imports: [
    ManagersModule,
    MongooseModule.forFeature([{ name: 'Tokens', schema: TokenSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    JwtService,
  ],
  exports: [AuthModule],
})
export class AuthModule {}
