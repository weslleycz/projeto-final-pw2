import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './services/prisma.service';
import { UserController } from './controllers/user/user.controller';
import { JWTService } from './services/jwt.service';
import { BcryptService } from './services/bcrypt.service';

@Module({
  imports: [],
  controllers: [AppController, UserController],
  providers: [AppService, PrismaService, JWTService, BcryptService],
})
export class AppModule {}
