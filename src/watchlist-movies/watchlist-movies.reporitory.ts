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
    query.leftJoinAndSelect('watchlistmovies.movie', 'movie');
    // Do something here

    try {
      const watchlistMovies = await query.getMany();
      return watchlistMovies;
    } catch (error) {
      this.logger.error(`Failed to get watchlist movies`, error.stack);
      throw new InternalServerErrorException();
    }
  }

  async checkIfUserWatchedMovie(addMovieDto: AddMovieDto, user: User): Promise<boolean> {
    const { exMovieId } = addMovieDto;
    const { userId } = user;
    const query = this.createQueryBuilder('watchlistmovie');

    query
      .leftJoinAndSelect('watchlistmovie.movie', 'movie')
      .where('watchlistmovie.exMovieId = :exMovieId', { exMovieId })
      .andWhere('watchlistmovie.userId = :userId', { userId });

    try {
      const exists = await query.getOne();
      return exists ? true : false;
    } catch(error) {

    }
  }

  async addWatchlistMovie(
    addMovieDto: AddMovieDto,
    user: User,
  ): Promise<any> {
    const { exMovieId } = addMovieDto;

    const watchlistMovie = new WatchlistMovie();
    watchlistMovie.addedDate = new Date();
    watchlistMovie.hasWatched = true;
    watchlistMovie.user = user;
    watchlistMovie.exMovieId = exMovieId;

    try {
      await watchlistMovie.save();
    } catch (error) {
      this.logger.error(`Failed to create watchlist ${error.code}`, error.stack);
      throw new InternalServerErrorException();
    }

    delete watchlistMovie.user;

    return watchlistMovie;
  }
}
