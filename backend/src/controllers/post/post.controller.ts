import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Headers,
  Get,
  Param,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiHeader,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { CreatePostResponse } from 'src/schemas/CreatePostResponse';
import { JWTService } from 'src/services/jwt.service';
import { PrismaService } from 'src/services/prisma.service';
import { CreatePostDto } from 'src/validators/Post.dtos';
import { Post as IPost } from '@prisma/client';
import { ListPostResponse } from 'src/schemas/ListPostResponse';
import { Response, Request } from 'express';

type IJWT = {
  data: string;
};

@Controller('post')
@ApiTags('Post')
export class PostController {
  constructor(
    private prismaService: PrismaService,
    private jWTService: JWTService,
  ) {}
  @Get()
  @ApiOperation({
    summary: 'Lista todas as postagens',
    description: 'Rota para listar todas as postagens.',
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna uma lista de postagens',
    type: ListPostResponse,
    isArray: true,
  })
  async getAll(): Promise<IPost[]> {
    return await this.prismaService.post.findMany({
      include: {
        comments: true,
      },
    });
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Retorna uma postagem por id',
    description: 'Rota que retorna uma postagem por id',
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna um postagem',
    type: ListPostResponse,
  })
  @ApiParam({ name: 'id', description: 'ID da postagem' })
  async getById(@Param('id') id: string) {
    return await this.prismaService.post.findUnique({
      where: {
        id,
      },
    });
  }

  @ApiOperation({
    summary: 'Criar postagem',
    description: 'Rota para criar postagem.',
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna uma mensagem de sucesso',
    type: CreatePostResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Não é possível realizar a postagem',
  })
  @ApiHeader({
    name: 'token',
    description: 'Token de autenticação',
    required: true,
  })
  @Post()
  @ApiBearerAuth()
  async create(
    @Body() { image, text }: CreatePostDto,
    @Headers() headers: Record<string, string>,
  ): Promise<CreatePostResponse> {
    if (typeof image === 'undefined') {
      try {
        const id = <IJWT>this.jWTService.decode(headers.token);
        await this.prismaService.post.create({
          data: {
            date: new Date().toString(),
            likes: [],
            text,
            userId: id.data,
          },
        });
        return { message: 'postagem criada com sucesso' };
      } catch (error) {
        throw new HttpException(
          'Não é possível realizar a postagem',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      try {
        const id = <IJWT>this.jWTService.decode(headers.token);
        await this.prismaService.post.create({
          data: {
            date: new Date().toString(),
            likes: [],
            text,
            userId: id.data,
            image: image,
          },
        });
        return { message: 'postagem criada com sucesso' };
      } catch (error) {
        throw new HttpException(
          'Não é possível realizar a postagem',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }
  delete(id: string): Promise<string> {
    throw new Error('Method not implemented.');
  }

  @Get('/like/:id')
  @ApiParam({ name: 'id', description: 'ID da postagem' })
  async likePost(
    @Param('id') id: string,
    @Headers() headers: Record<string, string>,
  ) {
    try {
      const token = <IJWT>this.jWTService.decode(headers.token);
      const post = await this.prismaService.post.findUnique({
        where: {
          id,
        },
      });
      const likes = Object.values(post.likes);
      const index = likes.indexOf(token.data);
      if (likes.includes(token.data)) {
        likes.splice(index, 1);
        await this.prismaService.post.update({
          where: {
            id,
          },
          data: {
            likes,
          },
        });
      } else {
        likes.push(token.data);
        await this.prismaService.post.update({
          where: {
            id,
          },
          data: {
            likes,
          },
        });
      }
      return { message: 'like dado com sucesso' };
    } catch (error) {
      throw new HttpException('Não é possível da like', HttpStatus.BAD_REQUEST);
    }
  }
}
