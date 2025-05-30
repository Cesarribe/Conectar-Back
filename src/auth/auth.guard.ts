import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token não fornecido');
    }

    try {
      const jwtSecret = this.configService.get<string>('JWT_SECRET');

      if (!jwtSecret) {
        throw new InternalServerErrorException('JWT_SECRET não foi configurado corretamente.');
      }

      const decoded = jwt.verify(token, jwtSecret);
      request.user = decoded;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}
