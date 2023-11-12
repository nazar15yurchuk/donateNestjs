import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { EStatus } from '../../common/enums';

export class UpdateCollectionDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(EStatus)
  status: EStatus;
}
