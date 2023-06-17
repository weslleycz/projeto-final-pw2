import { ApiProperty } from '@nestjs/swagger';

export class LoginUserResponse {
  @ApiProperty({
    description:
      'Se o cadastro for bem-sucedido retorna o token de validação para o usuário da entrar direto',
  })
  token: string;
}
