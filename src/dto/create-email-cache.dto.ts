import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEmailCacheDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  identifier: string;
}
