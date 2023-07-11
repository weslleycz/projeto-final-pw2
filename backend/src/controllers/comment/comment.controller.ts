import {
  Body,
  Controller,
  Post,
  Headers,
  Param,
  HttpException,
  HttpStatus,
  Get,
} from '@nestjs/common';
import {
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JWTService } from 'src/services/jwt.service';
import { PrismaService } from 'src/services/prisma.service';
import { CreateCommentDto } from 'src/validators/Comment.dto';

type IJWT = {
  data: string;
};

@Controller('comment')
@ApiTags('Comment')
export class CommentController {
  constructor(
    private prismaService: PrismaService,
    private jWTService: JWTService,
  ) {}
  @Post('/:id')
  @ApiOperation({
    summary: 'Criar um comentario',
    description: 'Rota para criar comentario.',
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna uma mensagem de sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Não é possível fazer o comentario',
  })
  @ApiHeader({
    name: 'token',
    description: 'Token de autenticação',
    required: true,
  })
  @ApiParam({ name: 'id', description: 'ID da postagem' })
  async create(
    @Body() { text }: CreateCommentDto,
    @Headers() headers: Record<string, string>,
    @Param('id') postId: string,
  ) {
    const userId = <IJWT>this.jWTService.decode(headers.token);
    try {
      await this.prismaService.comment.create({
        data: {
          text,
          date: new Date().toString(),
          postId,
          userId: userId.data,
        },
      });
    } catch (error) {
      throw new HttpException(
        'Não é possível realizar a postagem',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Lista de comentarios',
    description: 'Lista de comentarios por postagem',
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna uma lista de comentários',
  })
  @ApiParam({ name: 'id', description: 'ID da postagem' })
  async getComment(@Param('id') postId: string) {
    return await this.prismaService.comment.findMany({
      where: {
        postId: postId,
      },
    });
  }
}
