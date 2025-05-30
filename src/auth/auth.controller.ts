import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateDeveloperDto } from '../developers/dto/create-developer.dto';
import { CurrentUser } from './current-user.decorator';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('register')
  async register(@Body() dto: CreateDeveloperDto) {
    return this.authService.register(dto);
  }

    @Post('login')
  async login(@Body() { email, password }: { email: string; password: string }) {
    return this.authService.login(email, password);
  }

 
  @UseGuards(AuthGuard)
  @Get('me')
  async getProfile(@CurrentUser() user) {
    return user;
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
