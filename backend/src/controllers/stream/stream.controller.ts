import { Get, Controller, Res } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { CacheService } from '../../services/cache.service';
import { Post as IPost } from '@prisma/client';

@Controller()
export class StreamController {
  constructor(
    private prismaService: PrismaService,
    private cacheService: CacheService,
  ) {}

  @Get('/stream')
  stream(@Res() res) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.flushHeaders();

    const interval = setInterval(async () => {
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
        res.write(`data: ${JSON.stringify(posts.length)}\n\n`);
      } else {
        res.write(`data: ${JSON.stringify(postCache.length)}\n\n`);
      }
    }, 4000);

    res.on('close', () => {
      clearInterval(interval);
      res.end();
    });
  }
}
