import { Injectable, ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { TokenExpiredError } from "jsonwebtoken";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log(context);
    return true;
  }

  /*handleRequest(err, user, info: Error) {
    console.warn(`all fine`);
    if (err) {
      console.error(`error:${err} user: ${JSON.stringify(user)} info: ${info}`);
    }
    return user;
  }*/
}