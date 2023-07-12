import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Post as IPost } from '@prisma/client';
import { CreatePostResponse } from 'src/schemas/CreatePostResponse';
import { ListPostResponse } from 'src/schemas/ListPostResponse';
import { CacheService } from 'src/services/cache.service';
import { JWTService } from 'src/services/jwt.service';
import { PrismaService } from 'src/services/prisma.service';
import { CreatePostDto } from 'src/validators/Post.dtos';

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
    return posts;
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
            likes: JSON.stringify([]),
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
            likes: JSON.stringify([]),
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

      const likes = post.likes ? JSON.parse(post.likes) : [];
      const index = likes.indexOf(token.data);

      if (index !== -1) {
        likes.splice(index, 1);
      } else {
        likes.push(token.data);
      }

      await this.prismaService.post.update({
        where: {
          id,
        },
        data: {
          likes: JSON.stringify(likes),
        },
      });

      return { message: 'like dado com sucesso' };
    } catch (error) {
      throw new HttpException(
        'Não é possível dar like',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
