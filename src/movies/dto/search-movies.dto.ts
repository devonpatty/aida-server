import { IsString, IsInt, IsOptional } from "class-validator";

export class SearchMoviesDto {
  @IsString()
  readonly search: string;

  @IsOptional()
  readonly page?: number;
}