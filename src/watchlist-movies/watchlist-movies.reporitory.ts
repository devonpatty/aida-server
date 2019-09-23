import { EntityRepository, Repository } from "typeorm";
import { WatchlistMovie } from "../entities/watchlist-movies.entity";
import { Logger, InternalServerErrorException } from "@nestjs/common";
import { AddMovieDto } from "../movies/dto/add-movie.dto";
import { Movie } from "../entities/movie.entity";
import { User } from "../entities/user.entity";

@EntityRepository(WatchlistMovie)
export class WatchlistMovieRepository extends Repository<WatchlistMovie> {
  private logger = new Logger('WatchlistMovieRepository');

  async getWatchlistMovies(user: User): Promise<WatchlistMovie[]> {
    const query = this.createQueryBuilder('watchlistmovies');

    query.where('watchlistmovies.userId = :userId', { userId: user.userId });
    // Do something here

    try {
      const watchlistMovies = await query.getMany();
      return watchlistMovies;
    } catch (error) {
      this.logger.error(`Failed to get watchlist movies`, error.stack);
      throw new InternalServerErrorException();
    }
  }

  async addWatchlistMovie(
    addMovieDto: AddMovieDto,
    user: User,
  ): Promise<any> {
    const { exMovieId, title, overview, posterPath, releaseDate } = addMovieDto;

    // Maybe move the validateMovie to the service
    if (await this.validateMovie(addMovieDto)) {
      this.logger.error(`"${title}" exists in Movies entity with exMovieId: "${exMovieId}" associated username: "${user.username}", userId: "${user.userId}"`);
      return { message: 'The movies is already exists' };
    } else {
      const movie = new Movie();
      movie.exMovieId = exMovieId;
      movie.title = title;
      movie.overview = overview;
      movie.posterPath = posterPath;
      movie.releaseDate = releaseDate;
  
      const watchlistMovie = new WatchlistMovie();
      watchlistMovie.addedDate = new Date();
      watchlistMovie.user = user;
      watchlistMovie.movie = movie;
  
      try {
        await movie.save();
        await watchlistMovie.save();
      } catch (error) {
        this.logger.error(`Failed to create watchlist ${error.code}`, error.stack);
        throw new InternalServerErrorException();
      }
  
      delete watchlistMovie.user;
  
      return watchlistMovie;
    }
  }

  async validateMovie(addMovieDto: AddMovieDto): Promise<boolean> {
    const { exMovieId } = addMovieDto;
    const query = this.createQueryBuilder('watchlistmovie');

    query.leftJoinAndSelect('watchlistmovie.movie', 'movies')
          .where('watchlistmovie.exMovieId = :exMovieId', { exMovieId });

    const movie = await query.getOne();
    if (movie) {
      return true;
    }
    return false;
  }
}
