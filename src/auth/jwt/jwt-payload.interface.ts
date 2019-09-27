export class JwtPayload {
  readonly username: string;
  readonly iat?: Date;
  readonly exp?: Date;
}