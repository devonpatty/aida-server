import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthFormDto } from './dto/auth-form.dto';
//import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt/jwt-payload.interface';
import { sign, verify } from 'jsonwebtoken';

import * as config from 'config';
import { User } from 'src/entities/user.entity';

const jwtConfig = config.get('jwt');

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    //private jwtService: JwtService,
  ) {}

  async signUp(
    authFormDto: AuthFormDto,
  ): Promise<void> {
    return this.userRepository.signUp(authFormDto);
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<any> {
    const user = await this.userRepository.validateUserPassword(authCredentialsDto);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payloadAccessToken: JwtPayload = { 
      userId: user.userId,
      username: user.username,
    };

    const payloadRefreshToken: JwtPayload = {
      userId: user.userId,
      username: user.username,
      tokenVersion: user.tokenVersion,
    };

    const accessToken = await this.createAccessTokens(payloadAccessToken);
    const refreshToken = await this.createRefreshToken(payloadRefreshToken);
    
    return { accessToken, refreshToken };
  }

  async findUser(userId): Promise<User> {
    return await this.userRepository.findOne({ userId });
  }

  async verifyRefreshToken(token): Promise<any> {
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
