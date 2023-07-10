import { Body, Controller, Post, Headers } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JWTService } from 'src/services/jwt.service';
import { PrismaService } from 'src/services/prisma.service';
import { CreateCommentDto } from 'src/validators/Comment.dto';

type IJWT = {
  data: string;
};

@Controller('comment')
export class CommentController {
  constructor(
    private prismaService: PrismaService,
    private jWTService: JWTService,
  ) {}
  @Post()
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
  async create(
    @Body() { text }: CreateCommentDto,
    @Headers() headers: Record<string, string>,
  ) {
    const id = <IJWT>this.jWTService.decode(headers.token);
    try {
        await this.
    } catch (error) {}
  }
}
