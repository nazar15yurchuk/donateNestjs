import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { EStatus } from '../../common';

export class UpdateCollectionDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(EStatus)
  status: EStatus;
}
