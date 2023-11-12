import { IsEmail, IsString } from 'class-validator';

export class LoginManagerDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
