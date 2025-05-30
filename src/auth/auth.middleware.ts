import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface AuthRequest extends Request {
  user?: jwt.JwtPayload; // ✅ Adicionamos `user` ao tipo `Request`
}

export class AuthMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('Token não fornecido.');
      }

      const secret = this.configService.get<string>('JWT_SECRET');
      if (!secret) {
        throw new InternalServerErrorException('Erro crítico: JWT_SECRET não foi configurado.');
      }

      const decoded = jwt.verify(token, secret) as jwt.JwtPayload;

      if (!decoded || !decoded.id) {
        throw new UnauthorizedException('Token inválido ou corrompido.');
      }

      req.user = decoded; // ✅ Agora `req.user` será reconhecido!

      next();
    } catch (error) {
      throw new UnauthorizedException('Token inválido ou expirado.');
    }
  }
}
