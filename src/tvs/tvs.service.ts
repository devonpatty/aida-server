import { Injectable, HttpService, Logger } from '@nestjs/common';
import { SearchTvsDto } from './dto/search-tvs.dto';
import * as config from 'config';

const API_KEY = config.get('api.key');

@Injectable()
export class TvsService {
  constructor(
    private readonly httpService: HttpService,
  ) {}

  private readonly logger = new Logger(TvsService.name);

  async searchTvs(searchTvsDto: SearchTvsDto): Promise<any> {
    const { search } = searchTvsDto;
    let result;

    try {
      result = await this.httpService.get(`https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&language=en-US&query=${search}&page=1&include_adult=false`).toPromise();
      return result.data;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
