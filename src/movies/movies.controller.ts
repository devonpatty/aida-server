import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { SearchMoviesDto } from './dto/search-movies.dto';

@Controller('movies')
export class MoviesController {
  constructor(
    private readonly moviesService: MoviesService,
  ) {}

  @Get()
  async searchMovies(@Query(ValidationPipe) searchMoviesDto: SearchMoviesDto): Promise<any> {
    return this.moviesService.searchMovies(searchMoviesDto);
  }
  
}
