import {
  Controller,
  Put,
  HttpException,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  Headers,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiHeader,
} from '@nestjs/swagger';
import { GridFsService } from 'src/services/gridfs.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Readable } from 'node:stream';
import { JWTService } from 'src/services/jwt.service';
import { PrismaService } from 'src/services/prisma.service';
import { ObjectId } from 'mongodb';
import { Response } from 'express';

type IJWT = {
  data: string;
};

@Controller('files')
@ApiTags('Files')
export class FilesController {
  constructor(
    private gridFsService: GridFsService,
    private jwtService: JWTService,
    private prismaService: PrismaService,
  ) {}

  @Put('upload/avatar')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload avatar' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Avatar image file',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiHeader({
    name: 'token',
    description: 'Token de autenticação',
    required: true,
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile() file,
    @Headers() headers: Record<string, string>,
  ) {
    try {
      const { buffer, originalname } = file;
      const fileStream = new Readable();
      fileStream.push(buffer);
      fileStream.push(null);
      const id = <IJWT>this.jwtService.decode(headers.token);
      const fileId = await this.gridFsService.uploadFile(
        fileStream,
        originalname,
      );
      const idAvatar = fileId.toString() as string;
      await this.prismaService.user.update({
        data: {
          avatar: idAvatar,
        },
        where: {
          id: id.data.toString(),
        },
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Não é possível fazer upload desse arquivo',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiOperation({
    summary: 'Baixar a foto de perfil',
    description: 'Rota que retorna a imagem de perfil do usuario.',
  })
  @Get('avatar/:id')
  async getAvatar(@Param('id') id: string, @Res() res: Response) {
    const user = await this.prismaService.user.findFirst({
      where: {
        id,
      },
    });
    if (user.avatar != null) {
      const fileStream = this.gridFsService.getFileStream(
        ObjectId.createFromHexString(user.avatar),
      );
      res.set({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename=${user.avatar}`,
      });
      (await fileStream).pipe(res);
    } else {
      throw new HttpException('Avatar not found', HttpStatus.NOT_FOUND);
    }
  }

  @ApiOperation({
    summary: 'Baixar a imahem',
    description: 'Rota que retorna a imagem.',
  })
  @Get('download/:id')
  async getFile(@Param('id') id: string, @Res() res: Response) {
    const fileStream = this.gridFsService.getFileStream(
      ObjectId.createFromHexString(id),
    );
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename=${id}`,
    });
    (await fileStream).pipe(res);
  }

  @Put('upload')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload de arquivos' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload de file',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiHeader({
    name: 'token',
    description: 'Token de autenticação',
    required: true,
  })
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file) {
    try {
      const { buffer, originalname } = file;
      const fileStream = new Readable();
      fileStream.push(buffer);
      fileStream.push(null);
      const fileId = await this.gridFsService.uploadFile(
        fileStream,
        originalname,
      );
      return fileId;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Não é possível fazer upload desse arquivo',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
