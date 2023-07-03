import { Get, Controller, Res } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';

@Controller()
export class StreamController {
  constructor(private prismaService: PrismaService) {}

  @Get('/stream')
  stream(@Res() res) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.flushHeaders();

    const interval = setInterval(async () => {
      const posts = await this.prismaService.post.findMany();
      res.write(`data: ${JSON.stringify(posts.length)}\n\n`);
    }, 4000);

    res.on('close', () => {
      clearInterval(interval);
      res.end();
    });
  }
}
