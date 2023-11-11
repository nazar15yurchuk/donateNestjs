import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CollectionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  link: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  status: string;

  @IsString()
  @IsOptional()
  image?: string;
}
