import { Controller, Post, Body, ValidationPipe, Res } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { AuthFormDto } from './dto/auth-form.dto';
import { Response } from 'express';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('/signup')
  async signUp(
    @Body(ValidationPipe) authFormDto: AuthFormDto,
  ): Promise<void> {
    return this.authService.signUp(authFormDto);
  }

  @Post('/signin')
  async signIn(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
    @Res() res: Response,
  ): Promise<any> {
    const { accessToken, refreshToken } = await this.authService.signIn(authCredentialsDto);
    // 7 * 24 * 60 * 60 * 1000 === 604800000, 7 days in milliseconds
    const duration = new Date(Number(new Date()) + 604800000);

    res.cookie(
      'jid',
      refreshToken,
      { 
        expires: duration,
        httpOnly: true,
      },
    );

    return res.send({ accessToken });
  }
}
