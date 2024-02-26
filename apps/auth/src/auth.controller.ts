import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  AuthServiceController,
  AuthServiceControllerMethods,
  CurrentUser,
  UserDocument,
} from '@app/common';

@Controller('auth')
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response);

    response.send(user);
  }

  @UseGuards(JwtAuthGuard)
  async authenticate(data) {
    return {
      ...data.user,
      id: data.user._id,
    };
  }
}
