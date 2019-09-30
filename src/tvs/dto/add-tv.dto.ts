import { IsNumber, IsPositive, IsNotEmpty, IsString, IsDateString } from "class-validator";

export class AddTvDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  readonly exTvId: number;

  @IsString()
  readonly title: string;

  @IsString()
  readonly overview?: string;

  @IsString()
  readonly posterPath?: string;

  @IsDateString()
  readonly releaseDate?: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  readonly exSeasonId: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  readonly seasonNumber: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  readonly exEpisodeId: number;
}