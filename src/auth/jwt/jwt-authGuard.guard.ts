import { Injectable, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { TokenExpiredError, decode, sign } from "jsonwebtoken";
import { AuthGuard } from "@nestjs/passport";
import * as config from 'config';

const jwtConfig = config.get('jwt');

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log(request);
    const result = (await super.canActivate(context) as boolean);
    await super.logIn(request);
    console.log(result);
    return result;
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}