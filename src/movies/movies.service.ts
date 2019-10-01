import { Injectable, HttpService, Logger } from '@nestjs/common';
import { SearchMoviesDto } from './dto/search-movies.dto';
import * as config from 'config';

const API_KEY = config.get('api.key');

@Injectable()
export class MoviesService {
  constructor(
    private readonly httpService: HttpService,
  ) {}

  private readonly logger = new Logger(MoviesService.name);

  async searchMovies(searchMoviesDto: SearchMoviesDto): Promise<any> {
    const { search } = searchMoviesDto;
    let result: any;

    try {
      result = await this.httpService.get(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${search}&page=1&include_adult=false`).toPromise();
      return result.data;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
