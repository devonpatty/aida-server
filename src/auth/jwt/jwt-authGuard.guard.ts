import { Injectable, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { TokenExpiredError, decode, sign } from "jsonwebtoken";
import { AuthGuard } from "@nestjs/passport";
import * as config from 'config';

const jwtConfig = config.get('jwt');

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

}