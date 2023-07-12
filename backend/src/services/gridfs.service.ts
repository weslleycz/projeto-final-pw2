import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class GridFsService {
  constructor(private prisma: PrismaService) {}
  async uploadFile(
    fileStream: NodeJS.ReadableStream,
    filename: string,
  ): Promise<string> {
    const buffer = await streamToBuffer(fileStream);

    // Salve o buffer no banco de dados usando o Prisma
    const arquivo = await this.prisma.img.create({
      data: {
        filename: filename,
        buffer: buffer,
      },
    });

    return arquivo.id;
  }

  async getFileStream(fileId: string): Promise<NodeJS.ReadableStream> {
    // Recupere o arquivo do banco de dados usando o Prisma
    const arquivo = await this.prisma.img.findUnique({
      where: {
        id: fileId,
      },
    });

    // Crie um ReadableStream a partir do conteúdo do arquivo
    const stream = bufferToStream(arquivo.buffer);

    return stream;
  }
}

// Função utilitária para converter um ReadableStream em um Buffer
function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk: Buffer) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', (error: Error) => reject(error));
  });
}

function bufferToStream(buffer: Buffer): NodeJS.ReadableStream {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const stream = new (require('stream').Readable)();
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  stream._read = () => {}; // eslint-disable-line no-underscore-dangle
  stream.push(buffer);
  stream.push(null);
  return stream;
}
