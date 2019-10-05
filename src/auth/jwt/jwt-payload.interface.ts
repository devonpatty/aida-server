export class JwtPayload {
  readonly userId: number;
  readonly username: string;
  readonly iat?: Date;
  readonly exp?: Date;
}