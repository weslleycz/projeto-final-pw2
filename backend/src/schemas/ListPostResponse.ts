import { ApiProperty } from '@nestjs/swagger';
import { Post } from '@prisma/client';

export class ListPostResponse implements Post {
  @ApiProperty({
    description: 'Id da postagem',
  })
  id: string;
  @ApiProperty({
    description: 'Texo da postagem',
  })
  text: string;
  @ApiProperty({
    description: 'Imagem da postagem',
  })
  image: string;
  @ApiProperty({
    description: 'Data de publicação',
  })
  date: string;
  @ApiProperty({
    description: 'Quantidade de likes',
  })
  likes: number;
  @ApiProperty({
    description: 'ID do usuário',
  })
  userId: string;
}
