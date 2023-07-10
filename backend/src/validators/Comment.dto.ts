import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ description: 'Texto do comentario' })
  @IsString()
  @IsNotEmpty()
  text: string;
}
