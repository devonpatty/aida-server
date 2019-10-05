import { Controller, Post, Body, ValidationPipe, Get, Req, Res, Header } from '@nestjs/common';
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
    //@Res() res: Response,
  ): Promise<any> {
    return this.authService.signIn(authCredentialsDto);
    /*res.cookie(
      'jid',
      refreshToken,
      { httpOnly: true },
    );*/

  }
}
