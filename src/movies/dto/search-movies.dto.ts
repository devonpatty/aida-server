import { IsString } from "class-validator";

export class SearchMoviesDto {
  @IsString()
  readonly search: string;
}