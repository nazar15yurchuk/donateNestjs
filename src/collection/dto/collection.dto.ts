import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CollectionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  link: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  // @IsNotEmpty()
  @IsOptional()
  @Min(0, { message: 'Sum must be at least 0.' })
  sum?: string;

  // @IsString()
  @IsOptional()
  image?: Express.Multer.File;
}
