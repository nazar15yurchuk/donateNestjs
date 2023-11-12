import { IsEmail, IsString } from 'class-validator';

export class RegisterManagerDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
