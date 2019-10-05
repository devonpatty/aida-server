export class JwtPayload {
  userId: number;
  username: string;
  iat?: Date;
  exp?: Date;
  tokenVersion?: number;
}