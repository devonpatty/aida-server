import { Injectable } from '@nestjs/common';
import { AddMovieDto } from '../movies/dto/add-movie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WatchlistMovieRepository } from './watchlist-movies.reporitory';
import { User } from '../entities/user.entity';
import { WatchlistMovie } from '../entities/watchlist-movies.entity';

@Injectable()
export class WatchlistMoviesService {
  constructor(
    @InjectRepository(WatchlistMovieRepository)
    private readonly watchlistMovieRepository: WatchlistMovieRepository,
  ) {}

  async getWatchlistMovies(user: User): Promise<WatchlistMovie[]> {
    return this.watchlistMovieRepository.getWatchlistMovies(user);
  }

  async addWatchlistMovie(
    addMovieDto: AddMovieDto,
    user: User,
  ): Promise<any> {
    return this.watchlistMovieRepository.addWatchlistMovie(addMovieDto, user);
  }
}
