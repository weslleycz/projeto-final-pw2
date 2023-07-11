import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './services/prisma.service';
import { UserController } from './controllers/user/user.controller';
import { JWTService } from './services/jwt.service';
import { BcryptService } from './services/bcrypt.service';
import { JwtGuardMiddleware } from './middlewares/jwt-guard/jwt-guard.middleware';
import { FilesController } from './controllers/files/files.controller';
import { GridFsService } from './services/gridfs.service';
import { PostController } from './controllers/post/post.controller';
import { StreamController } from './controllers/stream/stream.controller';
import { CacheService } from './services/cache.service';
import { CommentController } from './controllers/comment/comment.controller';

@Module({
  imports: [],
  controllers: [
    AppController,
    UserController,
    FilesController,
    PostController,
    StreamController,
    CommentController,
  ],
  providers: [
    AppService,
    PrismaService,
    JWTService,
    BcryptService,
    GridFsService,
    CacheService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtGuardMiddleware)
      .forRoutes({ path: 'user/delete/:id', method: RequestMethod.DELETE });
    consumer
      .apply(JwtGuardMiddleware)
      .forRoutes({ path: '/user/private/token', method: RequestMethod.GET });
    consumer.apply(JwtGuardMiddleware).forRoutes({
      path: 'files/upload/avatar',
      method: RequestMethod.PUT,
    });
    consumer.apply(JwtGuardMiddleware).forRoutes({
      path: 'post',
      method: RequestMethod.POST,
    });
    consumer.apply(JwtGuardMiddleware).forRoutes({
      path: 'post',
      method: RequestMethod.DELETE,
    });
    consumer.apply(JwtGuardMiddleware).forRoutes({
      path: '/post/like/:id',
      method: RequestMethod.GET,
    });
    consumer.apply(JwtGuardMiddleware).forRoutes({
      path: '/comment/:id',
      method: RequestMethod.POST,
    });
  }
}
