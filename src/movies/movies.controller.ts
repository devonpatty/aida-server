import { Controller, Get, Body, ValidationPipe } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { SearchMoviesDto } from './dto/search-movies.dto';

@Controller('movies')
export class MoviesController {
  constructor(
    private readonly moviesService: MoviesService,
  ) {}

  @Get('/search')
  async searchMovies(@Body(ValidationPipe) searchMoviesDto: SearchMoviesDto): Promise<any> {
    return this.moviesService.searchMovies(searchMoviesDto);
  }
}
