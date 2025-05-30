import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() { email, password }: { email: string; password: string }) {
    return this.authService.login(email, password);
  }

  @Post('refresh-token')
  async refreshToken(@Body() { refreshToken }: { refreshToken: string }) {
    return this.authService.refreshToken(refreshToken);
  }

  @Post('logout')
  async logout(@Body() { refreshToken }: { refreshToken: string }) {
    return this.authService.logout(refreshToken);
  }
}

