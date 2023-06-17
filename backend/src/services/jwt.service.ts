import { Injectable } from '@nestjs/common';
import jwt, { sign, verify as verifyJWT, decode } from 'jsonwebtoken';

@Injectable()
export class JWTService {
  public login(id: string): string {
    console.log(process.env.Security_JWT);
    return sign({ data: id }, process.env.Security_JWT, {
      expiresIn: '72h',
    });
  }

  public verify(token: string): boolean {
    try {
      verifyJWT(token, process.env.Security_JWT);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  public decode(token: string) {
    return decode(token);
  }
}
