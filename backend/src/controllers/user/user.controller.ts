import { Controller, Post, Get, Delete } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { PrismaService } from '../../services/prisma.service';
import { BaseController } from 'src/common/BaseController.common';
import { IUser, User } from '../../types/IUser';

@Controller('user')
@ApiTags('User')
export class UserController extends BaseController {
  constructor(private prismaService: PrismaService) {
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
}
