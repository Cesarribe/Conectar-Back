import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { RefreshToken } from './refresh-token.entity';
import { Developer } from '../developers/entities/developer.entity';
import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

interface JwtPayload extends jwt.JwtPayload {
  id: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Developer) private readonly developerRepo: Repository<Developer>,
    @InjectRepository(RefreshToken) private readonly refreshTokenRepo: Repository<RefreshToken>,
  ) {}

  async login(email: string, password: string) {
    const user = await this.developerRepo.findOneBy({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const accessSecret = this.configService.get<string>('JWT_SECRET');
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');

    if (!accessSecret || !refreshSecret) {
      throw new InternalServerErrorException('Configuração JWT inválida.');
    }

    const accessToken = jwt.sign({ id: user.id, role: user.role }, accessSecret, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user.id }, refreshSecret, { expiresIn: '7d' });

    await this.refreshTokenRepo.save({ token: refreshToken, user });

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    const storedToken = await this.refreshTokenRepo.findOneBy({ token: refreshToken });
    if (!storedToken || storedToken.revokedAt) {
      throw new UnauthorizedException('Refresh Token inválido ou expirado.');
    }

    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
    const accessSecret = this.configService.get<string>('JWT_SECRET');

    if (!refreshSecret || !accessSecret) {
      throw new InternalServerErrorException('Configuração JWT inválida.');
    }

    const decoded = jwt.verify(refreshToken, refreshSecret) as JwtPayload;

    if (!decoded || !decoded.id) {
      throw new UnauthorizedException('Token inválido ou corrompido.');
    }

    const newAccessToken = jwt.sign({ id: decoded.id }, accessSecret, { expiresIn: '1h' });

    return { accessToken: newAccessToken };
  }

  async logout(refreshToken: string) {
    await this.refreshTokenRepo.update({ token: refreshToken }, { revokedAt: new Date() });
    return { message: 'Logout realizado com sucesso.' };
  }
}
