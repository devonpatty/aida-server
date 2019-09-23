import { AuthCredentialsDto } from "./auth-credentials.dto";
import { IsEmail } from "class-validator";

export class AuthFormDto extends AuthCredentialsDto {
  @IsEmail()
  readonly email: string;
}