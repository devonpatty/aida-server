import { Injectable } from '@nestjs/common';
import { AddMovieDto } from '../movies/dto/add-movie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WatchlistMovieRepository } from './watchlist-movies.reporitory';
import { User } from '../entities/user.entity';
import { WatchlistMovie } from '../entities/watchlist-movies.entity';
import { MovieRepository } from '../movies/movies.repository';

@Injectable()
export class WatchlistMoviesService {
  constructor(
    @InjectRepository(WatchlistMovieRepository)
    private readonly watchlistMovieRepository: WatchlistMovieRepository,

    @InjectRepository(MovieRepository)
    private readonly movieRepository: MovieRepository,
  ) {}

  async getWatchlistMovies(user: User, page: number): Promise<WatchlistMovie[]> {
    return this.watchlistMovieRepository.getWatchlistMovies(user, page);
  }

  async addWatchlistMovie(
    addMovieDto: AddMovieDto,
    user: User,
  ): Promise<any> {
    const movieExists = await this.watchlistMovieRepository.checkIfUserWatchedMovie(addMovieDto, user);
    
    if (!movieExists) {
      await this.movieRepository.addMovie(addMovieDto);
      const watchlist = await this.watchlistMovieRepository.addWatchlistMovie(addMovieDto, user);
      return watchlist;
    } else {
      return { message: 'watched' };
    }
  }
}
