import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthFormDto } from './dto/auth-form.dto';
//import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt/jwt-payload.interface';
import { sign, decode } from 'jsonwebtoken';

import * as config from 'config';

const jwtConfig = config.get('jwt');

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    //private readonly configurationService: ConfigurationService,
    //private jwtService: JwtService,
  ) {}

  async signUp(
    authFormDto: AuthFormDto,
  ): Promise<void> {
    return this.userRepository.signUp(authFormDto);
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<any> {
    const username = await this.userRepository.validateUserPassword(authCredentialsDto);

    if (!username) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { username };
    const accessToken = await this.createAccessTokens(payload);
    const refreshToken = await this.createRefreshToken(payload);
    
    return { accessToken, refreshToken };
  }

  async createAccessTokens(payload: JwtPayload): Promise<any> {
    const accessToken = sign(payload, jwtConfig.accessTokenSecret, { expiresIn: jwtConfig.expiresIn });
    return accessToken;
  }

  async createRefreshToken(payload: JwtPayload): Promise<any> {
    const refreshToken = sign(payload, jwtConfig.refreshTokenSecret, { expiresIn: jwtConfig.refreshToken });
    return refreshToken;
  }
}
