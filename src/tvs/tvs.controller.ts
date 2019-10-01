import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { TvsService } from './tvs.service';
import { SearchTvsDto } from './dto/search-tvs.dto';

@Controller('tvs')
export class TvsController {
  constructor(
    private readonly tvsService: TvsService,
  ) {}

  @Get()
  async searchTvs(@Query(ValidationPipe) searchTvsDto: SearchTvsDto): Promise<any> {
    return this.tvsService.searchTvs(searchTvsDto);
  }
}
