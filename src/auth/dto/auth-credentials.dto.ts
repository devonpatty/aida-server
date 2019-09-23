import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  @MinLength(4, { message: 'Username is too short. Expected >= $constraint1 characters, but actual is $value' })
  @MaxLength(20, { message: 'Username is too long. Expected <= $constraint1 characters, but actual is $value' })
  readonly username: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(
    /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    { message: 'password too weak' })
  readonly password: string;
}