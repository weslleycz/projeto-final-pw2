import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Headers,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiHeader,
  ApiParam,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { PrismaService } from '../../services/prisma.service';
import { BaseController } from 'src/common/BaseController.common';
import { IUser, User } from '../../types/IUser';
import { CreateUserDto, LoginUserDto } from 'src/validators/User.dtos';
import { JWTService } from 'src/services/jwt.service';
import { CreateUserResponse } from '../../schemas/CreateUserResponse';
import { BcryptService } from 'src/services/bcrypt.service';
import { LoginUserResponse } from 'src/schemas/LoginUserResponse';

type IJWT = {
  data: string;
};

@Controller('user')
@ApiTags('User')
export class UserController extends BaseController {
  constructor(
    private prismaService: PrismaService,
    private jWTService: JWTService,
    private bcryptService: BcryptService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({
    summary: 'Obter todos os usuários',
    description: 'Retorna uma lista de todos os usuários registrados.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários obtida com sucesso.',
    type: User,
    isArray: true,
  })
  async getAll(): Promise<any[]> {
    return await this.prismaService.user.findMany({
      select: {
        avatar: true,
        bio: true,
        cover: true,
        posts: true,
        email: true,
        id: true,
        name: true,
      },
    });
  }

  @Post()
  @ApiOperation({
    summary: 'Criar usuário',
    description: 'Rota para criar usuário.',
  })
  @ApiResponse({
    status: 201,
    description: 'Retorna o token do usuário',
    type: CreateUserResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'E-mail já está cadastrado',
  })
  async create(
    @Body() { email, name, password }: CreateUserDto,
  ): Promise<CreateUserResponse> {
    try {
      const cryptPassword = await this.bcryptService.hashPassword(password);
      const user = await this.prismaService.user.create({
        data: {
          password: cryptPassword,
          email,
          name,
          avatar: '',
          bio: '',
          cover: '',
        },
      });
      const token = this.jWTService.login(user.id.toString());
      return { token };
    } catch (error) {
      throw new HttpException(
        'E-mail já está cadastrado',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch('/:id')
  @ApiBearerAuth()
  async update(@Param('id') id: string): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Get('/pubic/:id')
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado', type: User })
  @ApiResponse({ status: 400, description: 'Usuário não encontrado' })
  async getById(@Param('id') id: string): Promise<any> {
    try {
      return await this.prismaService.user.findFirst({
        where: {
          id,
        },
        select: {
          avatar: true,
          bio: true,
          cover: true,
          posts: true,
          email: true,
          id: true,
          name: true,
        },
      });
    } catch (error) {
      throw new HttpException('Usuário não encontrado', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/private/token')
  @ApiOperation({ summary: 'Buscar usuário por Token' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado', type: User })
  @ApiHeader({
    name: 'token',
    description: 'Token de autenticação',
    required: true,
  })
  @ApiBearerAuth()
  async getByToken(@Headers() headers: Record<string, string>) {
    const id = <IJWT>this.jWTService.decode(headers.token);
    return await this.prismaService.user.findFirst({
      where: {
        id: id.data.toString(),
      },
      select: {
        avatar: true,
        bio: true,
        cover: true,
        posts: true,
        email: true,
        id: true,
        name: true,
      },
    });
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Excluir usuário por ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID do usuário a ser excluído',
  })
  @ApiHeader({
    name: 'token',
    description: 'Token de autenticação',
    required: true,
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Usuário excluído com sucesso' })
  @ApiResponse({ status: 400, description: 'Requisição inválida' })
  @ApiResponse({ status: 401, description: 'Acesso não autorizado' })
  async delete(@Param('id') id: string): Promise<string> {
    try {
      await this.prismaService.user.delete({
        where: {
          id: id,
        },
      });
      return 'Usuário excluído com sucesso';
    } catch (error) {
      throw new HttpException('Requisição inválida', HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  @ApiOperation({
    summary: 'Login de usuário',
    description: 'Rota para criar usuário.',
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna o token do usuário',
    type: CreateUserResponse,
  })
  @ApiResponse({ status: 401, description: 'Email não vinculado' })
  @ApiResponse({ status: 400, description: 'Senha incorreta' })
  async loginUser(
    @Body() { email, password }: LoginUserDto,
  ): Promise<LoginUserResponse> {
    const user = await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });
    if (user != null) {
      if (await this.bcryptService.comparePasswords(password, user.password)) {
        const token = this.jWTService.login(user.id.toString());
        return { token };
      } else {
        throw new HttpException('Senha incorreta', HttpStatus.UNAUTHORIZED);
      }
    } else {
      throw new HttpException('Email não vinculado', HttpStatus.UNAUTHORIZED);
    }
  }
}
