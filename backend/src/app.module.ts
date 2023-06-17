import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './services/prisma.service';
import { UserController } from './controllers/user/user.controller';
import { JWTService } from './services/jwt.service';
import { BcryptService } from './services/bcrypt.service';
import { JwtGuardMiddleware } from './middlewares/jwt-guard/jwt-guard.middleware';

@Module({
  imports: [],
  controllers: [AppController, UserController],
  providers: [AppService, PrismaService, JWTService, BcryptService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtGuardMiddleware)
      .forRoutes({ path: 'user/:id', method: RequestMethod.POST });
    consumer
      .apply(JwtGuardMiddleware)
      .forRoutes({ path: 'user/:id', method: RequestMethod.DELETE });
  }
}
