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
  Delete,
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
import { CacheService } from 'src/services/cache.service';

type IJWT = {
  data: string;
};

@Controller('post')
@ApiTags('Post')
export class PostController {
  constructor(
    private prismaService: PrismaService,
    private jWTService: JWTService,
    private cacheService: CacheService,
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
    const postCache = <IPost[]>await this.cacheService.get('posts');
    if (postCache === undefined) {
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
      return posts;
    } else {
      return postCache;
    }
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

  @Get('/user/:id')
  @ApiOperation({
    summary: 'Retorna a lista de postagens do usraiorio por id',
    description: 'Retorna a lista de postagens do usraiorio por id',
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna a lista de postagens do usraiorio por id',
    type: ListPostResponse,
  })
  @ApiParam({ name: 'id', description: 'ID do usuario' })
  async getUserId(@Param('id') userId: string) {
    return await this.prismaService.post.findMany({
      where: {
        userId,
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
        return { message: 'postagem criada com sucesso' };
      } catch (error) {
        throw new HttpException(
          'Não é possível realizar a postagem',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Exclui uma postagem' })
  @ApiParam({ name: 'id', description: 'ID da postagem' })
  async delete(@Param('id') id: string) {
    try {
      await this.prismaService.post.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new HttpException(
        'Não é possível deletar a postagem',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('/like/:id')
  @ApiOperation({ summary: 'Dá um like em uma postagem' })
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
      }
      return { message: 'like dado com sucesso' };
    } catch (error) {
      throw new HttpException('Não é possível da like', HttpStatus.BAD_REQUEST);
    }
  }
}
