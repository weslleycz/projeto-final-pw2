import { ApiProperty } from '@nestjs/swagger';

export class CreatePostResponse {
  @ApiProperty({
    description:
      'Se o cadastro for bem-sucedido retorna o token de validação para o usuário da entrar direto',
  })
  message: string;
}
