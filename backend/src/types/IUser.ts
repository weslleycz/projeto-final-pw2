import { ApiProperty } from '@nestjs/swagger';
import { IPost, Post } from './IPosts';

export type IUser = {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatar: string;
  cover: string;
  posts: IPost[];
};

export class User implements IUser {
  @ApiProperty({ description: 'ID do usuário' })
  id: string;
  @ApiProperty({ description: 'Nome do usuário' })
  name: string;
  @ApiProperty({ description: 'E-mail do usuário' })
  email: string;
  @ApiProperty({ description: 'Biografia do usuário' })
  bio: string;
  @ApiProperty({ description: 'URL do avatar do usuário' })
  avatar: string;
  @ApiProperty({ description: 'URL da imagem de capa do usuário' })
  cover: string;
  @ApiProperty({ description: 'Lista das postagens do usuário' })
  posts: Post[];
}
