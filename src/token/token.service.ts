import { Injectable } from '@nestjs/common';
import { JwtPayload } from '../auth/jwt/jwt-payload.interface';
import { sign, verify } from 'jsonwebtoken';

import * as config from 'config';

const jwtConfig = config.get('jwt');

@Injectable()
export class TokenService {
  async verifyRefreshToken(token: string): Promise<any> {
    return await verify(token, jwtConfig.refreshTokenSecret);
  }

  async createAccessTokens(payload: JwtPayload): Promise<any> {
    const accessToken = await sign(payload, jwtConfig.accessTokenSecret, { expiresIn: jwtConfig.accessToken });
    return accessToken;
  }

  async createRefreshToken(payload: JwtPayload): Promise<any> {
    const refreshToken = await sign(payload, jwtConfig.refreshTokenSecret, { expiresIn: jwtConfig.refreshToken });
    return refreshToken;
  }
}
