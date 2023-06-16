import { ApiProperty } from '@nestjs/swagger';

export type IPost = {
  id: string;
  text: string;
  image?: string;
  date: string;
  likes: number;
};

export class Post implements IPost {
  @ApiProperty({ description: 'O identificador único do post.' })
  id: string;
  @ApiProperty({ description: 'O texto do post' })
  text: string;
  @ApiProperty({
    description: 'URL opcional para uma imagem associada ao post.',
  })
  image?: string;
  @ApiProperty({ description: 'Data do post' })
  date: string;
  @ApiProperty({ description: 'O número de curtidas recebidas pelo post' })
  likes: number;
}
