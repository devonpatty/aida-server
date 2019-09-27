import { Controller, Post, Body, ValidationPipe, Get, Req } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { AuthFormDto } from './dto/auth-form.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('/signup')
  signUp(
    @Body(ValidationPipe) authFormDto: AuthFormDto,
  ): Promise<void> {
    return this.authService.signUp(authFormDto);
  }

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<any> {
    return this.authService.signIn(authCredentialsDto);
  }
}
