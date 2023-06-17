import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JWTService } from 'src/services/jwt.service';

@Injectable()
export class JwtGuardMiddleware implements NestMiddleware {
  constructor(private jWTService: JWTService) {}
  use(req: Request, res: Response, next: NextFunction) {
    if (this.jWTService.verify(req.headers.token as string)) {
      next();
    } else {
      return res.status(401).json({
        message: 'Acesso não autorizado',
      });
    }
  }
}
