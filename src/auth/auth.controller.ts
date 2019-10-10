import { Controller, Post, Body, ValidationPipe, Get, Req, Res, Header } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { AuthFormDto } from './dto/auth-form.dto';
import { Request, Response } from 'express';
import { JwtPayload } from './jwt/jwt-payload.interface';
import { TokenService } from '../token/token.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
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

  // different module or route for security purpose ??
  @Post('/refresh_token')
  async refreshToken(@Req() req: Request, @Res() res: Response): Promise<any> {
    const token = req.cookies.jid;
    if (!token) {
      return res.send({ success: false, accessToken: ''});
    }

    let payload: JwtPayload = null;
    try {
      payload = await this.tokenService.verifyRefreshToken(token);
    } catch (error) {
      console.log(error);
      return res.send({ success: false, accessToken: '' });
    }

    // token is valid and send accessToken
    const user = await this.authService.findUser(payload.userId);
    const toUser = {
      userId: user.userId,
      username: user.username,
    };
    const x = toUser;
    x['tokenVersion'] = user.tokenVersion;
    
    if (!user) {
      return res.send({ success: false, accessToken: '' });
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      return res.send({ success: false, accessToken: '' });
    }

    const refreshToken = await this.tokenService.createRefreshToken(x);
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

    return res.send({ success: true, accessToken: await this.tokenService.createAccessTokens(toUser) });
  }
}
