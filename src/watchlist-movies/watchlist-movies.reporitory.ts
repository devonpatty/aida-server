import { EntityRepository, Repository } from "typeorm";
import { WatchlistMovie } from "../entities/watchlist-movies.entity";
import { Logger, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { AddMovieDto } from "../movies/dto/add-movie.dto";
import { User } from "../entities/user.entity";

@EntityRepository(WatchlistMovie)
export class WatchlistMovieRepository extends Repository<WatchlistMovie> {
  private logger = new Logger(WatchlistMovieRepository.name);

  async getWatchlistMovies(user: User, page: number = 1): Promise<WatchlistMovie[]> {
    const { userId } = user;
    /*const query = this.createQueryBuilder('watchlistmovies');

    // add pagination || limit, offset
    query
      .where('watchlistmovies.userId = :userId', { userId: user.userId })
      .leftJoinAndSelect('watchlistmovies.movie', 'movie');
    */
    try {
      const watchlistMovies = await this.find({
        relations: ['movie'],
        where: { userId },
        order: {
          addedDate: "DESC", // newest first
        },
        take: 10,
        skip: 10 * (page - 1),
      });
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
      // some error handling here ...
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

  async deleteWatchlistMovie(user: User, id: number): Promise<any> {
    const { userId } = user;
    const del = await this.delete({ userId, exMovieId: id });

    if (del.affected === 0) {
      throw new NotFoundException(`Movie ${id} not found`);
    }

    return del;
  }
}
