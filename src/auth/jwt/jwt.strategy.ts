import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException} from '@nestjs/common';
import { JwtPayload } from './jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../../user/user.repository';
import { User } from '../../entities/user.entity';
import * as config from 'config';

const jwtConfig = config.get('jwt');

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || jwtConfig.accessTokenSecret,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { userId, iat, exp } = payload;
    const user = await this.userRepository.findOne({ userId });
    
    delete user.password;
    delete user.salt;
    delete user.email;

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}