import { IsInt, IsNegative } from "class-validator";

export class WatchlistTvDto {
  @IsInt()
  @IsNegative()
  readonly exTvId: number;

  @IsInt()
  @IsNegative()
  readonly exSeasonId: number;
  
  @IsInt()
  @IsNegative()
  readonly seasonNumber: number;

  @IsInt()
  @IsNegative()
  readonly exEpisodeId: number;
}