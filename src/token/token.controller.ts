import { Controller, Post, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtPayload } from '../auth/jwt/jwt-payload.interface';
import { TokenService } from './token.service';
import { UserService } from '../user/user.service';

@Controller()
export class TokenController {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  @Post('/refresh_token')
  async refreshToken(@Req() req: Request, @Res() res: Response): Promise<any> {
    // Get token from cookies
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
    const user = await this.userService.findUser(payload.userId);
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
