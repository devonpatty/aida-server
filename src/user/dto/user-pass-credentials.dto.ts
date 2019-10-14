import { IsString, MinLength, MaxLength, Matches } from "class-validator";

export class UserPassCredentials {
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(
    /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    { message: 'password too weak' })
  readonly currentPassword: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(
    /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    { message: 'password too weak' })
  readonly newPassword: string;
}