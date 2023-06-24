import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { Post } from '@prisma/client';

import { ApiProperty } from '@nestjs/swagger';
import { Match } from 'src/decorators/match.decorator';

export class CreateUserDto {
  @ApiProperty({ description: 'Nome do usuário' })
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  name: string;

  @ApiProperty({ description: 'Endereço de e-mail do usuário' })
  @IsString()
  @IsEmail({}, { message: 'E-mail inválido' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  email: string;

  @IsString()
  @ApiProperty({ description: 'Senha do usuário' })
  @MinLength(7, { message: 'A senha deve ter pelo menos 7 caracteres' })
  @MaxLength(20, { message: 'A senha deve ter no máximo 20 caracteres' })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Senha muito fraca',
  })
  password: string;

  @IsString()
  @ApiProperty({ description: 'Confirmação de senha do usuário' })
  @IsNotEmpty({ message: 'A confirmação de senha é obrigatória' })
  @Match('password', {
    message: 'As senhas não correspondem',
  })
  passwordConfirm: string;
}

export class LoginUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Você precisa informar o seu e-mail' })
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Você precisa informar a sua senha' })
  @ApiProperty()
  password: string;
}
