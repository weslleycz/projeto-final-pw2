import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UploadAvatarDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  @IsNotEmpty()
  avatar: any;
}
