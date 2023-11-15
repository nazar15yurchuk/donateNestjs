import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateCollectionByManagerDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  link?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'Sum must be at least 0.' })
  sum?: string;

  @IsOptional()
  image?: Express.Multer.File;
}
