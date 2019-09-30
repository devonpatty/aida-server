import { Controller, Logger, Post, Body, Get, UseGuards, Query, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { WatchlistMoviesService } from './watchlist-movies.service';
import { AddMovieDto } from '../movies/dto/add-movie.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../entities/user.entity';
import { GetUser } from '../auth/deco/get-user.decorator';
import { WatchlistMovie } from '../entities/watchlist-movies.entity';
//import { JwtAuthGuard } from '../auth/jwt/jwt-authGuard.guard';

@Controller('watchlistmovies')
@UseGuards(AuthGuard())
export class WatchlistMoviesController {
  private logger = new Logger(WatchlistMoviesController.name);

  constructor(
    private readonly watchlistMovieService: WatchlistMoviesService,
  ) {}

  @Get()
  async getWatchlistMovies(
    @Query('page') page: number,
    @GetUser() user: User
  ): Promise<WatchlistMovie[]> {
    return this.watchlistMovieService.getWatchlistMovies(user, page);
  } 

  @Post()
  async addWatchlistMovie(
    @Body() addMovieDto: AddMovieDto,
    @GetUser() user: User,
  ): Promise<any> {
    return this.watchlistMovieService.addWatchlistMovie(addMovieDto, user);
  }

  @Delete('/:id')
  async deleteWatchlistMovie(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User, 
  ): Promise<any> {
    return this.watchlistMovieService.deleteWatchlistMovie(user, id);
  }
}
