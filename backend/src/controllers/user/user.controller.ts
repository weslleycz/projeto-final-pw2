import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { BaseController } from 'src/common/BaseController.common';
import { BcryptService } from 'src/services/bcrypt.service';
import { CacheService } from 'src/services/cache.service';
import { JWTService } from 'src/services/jwt.service';
import { CreateUserDto, LoginUserDto } from 'src/validators/User.dtos';
import { CreateUserResponse } from '../../schemas/CreateUserResponse';
import { PrismaService } from '../../services/prisma.service';
import { User } from '../../types/IUser';

type IJWT = {
  data: string;
};

type IUserUpdate = {
  name: string;
  bio: string;
  avatar: string;
  cover: string;
};

@Controller('user')
@ApiTags('User')
export class UserController extends BaseController {
  constructor(
    private prismaService: PrismaService,
    private jWTService: JWTService,
    private bcryptService: BcryptService,
    private cacheService: CacheService,
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
  async create(@Body() { email, name, password }: CreateUserDto) {
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
      return { token, id: user.id };
    } catch (error) {
      throw new HttpException(
        'E-mail já está cadastrado',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch('/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualiza um usuário por ID' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiOkResponse({ description: 'Usuário atualizado com sucesso' })
  @ApiBadRequestResponse({ description: 'Não foi possível editar o usuário' })
  async update(
    @Param('id') id: string,
    @Body() { bio, name, avatar, cover }: IUserUpdate,
  ): Promise<any> {
    try {
      const user = await this.prismaService.user.update({
        data: {
          bio,
          name,
          avatar: avatar,
          cover,
        },
        where: {
          id: id,
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
      const posts = await this.prismaService.post.findMany({
        include: {
          comments: true,
          User: {
            select: {
              avatar: true,
              name: true,
              id: true,
              email: true,
            },
          },
        },
      });
      await this.cacheService.set('posts', posts);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Não foi possivel editar o usuário',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('/pubic/:id')
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado', type: User })
  @ApiResponse({ status: 400, description: 'Usuário não encontrado' })
  async getById(@Param('id') id: string): Promise<any> {
    try {
      const user = await this.prismaService.user.findFirst({
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
      return user;
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
  async loginUser(@Body() { email, password }: LoginUserDto) {
    const user = await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });
    if (user != null) {
      if (await this.bcryptService.comparePasswords(password, user.password)) {
        const token = this.jWTService.login(user.id.toString());
        return { token, id: user.id };
      } else {
        throw new HttpException('Senha incorreta', HttpStatus.UNAUTHORIZED);
      }
    } else {
      throw new HttpException('Email não vinculado', HttpStatus.UNAUTHORIZED);
    }
  }
}
