import { Controller, Logger, Post, Body, Get, UseGuards } from '@nestjs/common';
import { WatchlistMoviesService } from './watchlist-movies.service';
import { AddMovieDto } from '../movies/dto/add-movie.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../entities/user.entity';
import { GetUser } from '../auth/deco/get-user.decorator';
import { WatchlistMovie } from '../entities/watchlist-movies.entity';

@Controller('watchlistmovies')
@UseGuards(AuthGuard())
export class WatchlistMoviesController {
  private logger = new Logger(WatchlistMoviesController.name);

  constructor(
    private readonly watchlistMovieService: WatchlistMoviesService,
  ) {}

  @Get()
  async getWatchlistMovies(@GetUser() user: User): Promise<WatchlistMovie[]> {
    return this.watchlistMovieService.getWatchlistMovies(user);
  } 

  @Post()
  async addWatchlistMovie(
    @Body() addMovieDto: AddMovieDto,
    @GetUser() user: User,
  ): Promise<any> {
    return this.watchlistMovieService.addWatchlistMovie(addMovieDto, user);
  }
}
