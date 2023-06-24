import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Headers,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiHeader,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BaseController } from 'src/common/BaseController.common';
import { CreatePostResponse } from 'src/schemas/CreatePostResponse';
import { JWTService } from 'src/services/jwt.service';
import { PrismaService } from 'src/services/prisma.service';
import { CreatePostDto } from 'src/validators/Post.dtos';

type IJWT = {
  data: string;
};

@Controller('post')
@ApiTags('Post')
export class PostController extends BaseController {
  constructor(
    private prismaService: PrismaService,
    private jWTService: JWTService,
  ) {
    super();
  }
  getAll(): Promise<any[]> {
    throw new Error('Method not implemented.');
  }
  getById(id: string): Promise<any> {
    throw new Error('Method not implemented.');
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
            likes: 0,
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
            likes: 0,
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
  update(id: string, data: any): Promise<any> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<string> {
    throw new Error('Method not implemented.');
  }
}
