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
    const [token] = await this.createTokens(payload);

    return { token };
  }

  async createTokens(payload: JwtPayload): Promise<any> {
    const createToken = sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
    //const createRefreshToken = sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.refreshToken });
    return Promise.all([createToken]);
  }
}
