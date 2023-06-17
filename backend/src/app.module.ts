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

@Module({
  imports: [],
  controllers: [AppController, UserController, FilesController],
  providers: [
    AppService,
    PrismaService,
    JWTService,
    BcryptService,
    GridFsService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtGuardMiddleware)
      .forRoutes({ path: 'user/:id', method: RequestMethod.POST });
    consumer
      .apply(JwtGuardMiddleware)
      .forRoutes({ path: 'user/:id', method: RequestMethod.DELETE });
    consumer.apply(JwtGuardMiddleware).forRoutes({
      path: 'files/upload/avatar',
      method: RequestMethod.PUT,
    });
  }
}
