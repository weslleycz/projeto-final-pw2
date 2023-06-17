import {
  Controller,
  Put,
  UploadedFile,
  Headers,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { GridFsService } from 'src/services/gridfs.service';
import { PrismaService } from 'src/services/prisma.service';
import { MulterFile } from 'multer';

@Controller('files')
@ApiTags('Files')
export class FilesController {
  constructor(
    private gridFsService: GridFsService,
    private prismaService: PrismaService,
  ) {}
  @Put('upload/avatar')
  @ApiResponse({ status: 401, description: 'Acesso não autorizado' })
  @ApiResponse({
    status: 400,
    description: 'Não é possível fazer upload desse arquivo',
  })
  async uploadAvatar(
    @UploadedFile() file: MulterFile.File,
    @Headers() headers: Record<string, string>,
  ) {
    try {
    } catch (error) {
      throw new HttpException(
        'Não é possível fazer upload desse arquivo',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
