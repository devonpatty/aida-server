import { IsNumber, IsPositive, IsNotEmpty, IsString, IsDateString } from "class-validator";

export class AddTvDto {
  @IsNumber({ allowNaN: false }, { message: 'The value has to be number' })
  @IsPositive({ message: 'The number has to be positive' })
  @IsNotEmpty({ message: 'The field is required' })
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