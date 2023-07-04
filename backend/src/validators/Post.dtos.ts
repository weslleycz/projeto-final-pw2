import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ description: 'Texto da postagem' })
  @IsString()
  @IsOptional()
  text: string;

  @ApiProperty({ description: 'ID da imagem da postagem' })
  @IsOptional()
  @IsString()
  image?: string;
}
