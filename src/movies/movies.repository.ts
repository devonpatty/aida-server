import { EntityRepository, Repository } from "typeorm";
import { Movie } from "../entities/movie.entity";
import { Logger, InternalServerErrorException } from "@nestjs/common";
import { AddMovieDto } from "./dto/add-movie.dto";

@EntityRepository(Movie)
export class MovieRepository extends Repository<Movie> {
  private readonly logger = new Logger(MovieRepository.name);

  async addMovie(addMovieDto: AddMovieDto): Promise<Movie> {
    const { exMovieId, title, overview, posterPath, releaseDate } = addMovieDto;
    const query = this.createQueryBuilder();

    const movie = new Movie();
    movie.exMovieId = exMovieId;
    movie.title = title;
    movie.overview = overview;
    movie.posterPath = posterPath;
    movie.releaseDate = releaseDate;

    try {
      await query
        .insert()
        .into(Movie)
        .values(movie)
        .onConflict(`("exMovieId") DO NOTHING`)
        .execute();
    } catch (error) {
      this.logger.error(`${error.code}`, error.stack);
      throw new InternalServerErrorException();
    }

    return movie;
  }

  async checkIfMovieExists(addMovieDto: AddMovieDto): Promise<boolean> {
    const query = this.createQueryBuilder('movie');

    const { exMovieId } = addMovieDto;

    query.where('movie.exMovieId = :exMovieId', { exMovieId });

    try {
      const exists = await query.getOne();
      return exists ? true : false;
    } catch (error) {
      // throw new InternalServerErrorException();
    }
  }
}