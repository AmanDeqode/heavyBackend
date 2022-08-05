import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { User } from '../../decorators/user.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { UserTokenSchema } from './interface/logout-request.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post('/login')
  async login(@Body() login: LoginDto) {
    const loginResponse = await this.authService.login(login);
    return loginResponse;
  }

  @Post('/refresh')
  async refresh(@Body() refresh: RefreshDto) {
    return this.authService.refresh(refresh);
  }

  @Get('/logout')
  async logout(@User() user: UserTokenSchema) {
    return this.authService.logout(user);
  }
}
