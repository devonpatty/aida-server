import { IsNumber, IsPositive, IsString, IsDateString, IsNotEmpty } from "class-validator";

export class AddMovieDto {
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    readonly exMovieId: number;

    @IsString()
    readonly title: string;

    @IsString()
    readonly overview: string;

    @IsString()
    readonly posterPath: string;

    @IsDateString()
    readonly releaseDate: string;
}