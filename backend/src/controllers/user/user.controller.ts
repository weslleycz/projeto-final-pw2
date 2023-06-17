import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiParam,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { PrismaService } from '../../services/prisma.service';
import { BaseController } from 'src/common/BaseController.common';
import { IUser, User } from '../../types/IUser';
import { CreateUserDto } from 'src/validators/User.dtos';
import { JWTService } from 'src/services/jwt.service';
import { CreateUserResponse } from '../../schemas/CreateUserResponse';
import { BcryptService } from 'src/services/bcrypt.service';

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
  async getAll(): Promise<IUser[]> {
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
      console.log(error);
      throw new HttpException(
        'E-mail já está cadastrado',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('/:id')
  async update(@Param('id') id: string): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado', type: User })
  @ApiResponse({ status: 400, description: 'Usuário não encontrado' })
  async getById(@Param('id') id: string): Promise<IUser> {
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
}
