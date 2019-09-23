import { IsString } from "class-validator";

export class SearchTvsDto {
  @IsString()
  readonly search: string;
}