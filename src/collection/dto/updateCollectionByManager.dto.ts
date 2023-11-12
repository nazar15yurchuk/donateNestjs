import { IsOptional, IsString} from 'class-validator';

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

  @IsString()
  // @IsNotEmpty()
  // @IsNumber()
  @IsOptional()
  // @Min(0, { message: 'Sum must be at least 0.' })
  sum?: string;

  @IsOptional()
  image?: Express.Multer.File;
}
