import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { RefreshToken } from './refresh-token.entity';
import { Developer } from '../developers/entities/developer.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Developer) private readonly developerRepo: Repository<Developer>,
    @InjectRepository(RefreshToken) private readonly refreshTokenRepo: Repository<RefreshToken>,
  ) {}

  async login(email: string, password: string) {
    const user = await this.developerRepo.findOneBy({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const accessToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    await this.refreshTokenRepo.save({ token: refreshToken, user });

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    const storedToken = await this.refreshTokenRepo.findOneBy({ token: refreshToken });
    if (!storedToken || storedToken.revokedAt) {
      throw new UnauthorizedException('Refresh Token inválido ou expirado');
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return { accessToken: newAccessToken };
  }

  async logout(refreshToken: string) {
    await this.refreshTokenRepo.update({ token: refreshToken }, { revokedAt: new Date() });
    return { message: 'Logout realizado com sucesso' };
  }
}
