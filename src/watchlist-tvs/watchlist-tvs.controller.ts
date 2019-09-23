import { Controller, Logger, Post, Body, UseGuards } from '@nestjs/common';
import { WatchlistTvsService } from './watchlist-tvs.service';
import { AddTvDto } from '../tvs/dto/add-tv.dto';
import { GetUser } from '../auth/deco/get-user.decorator';
import { User } from '../entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('watchlisttvs')
@UseGuards(AuthGuard())
export class WatchlistTvsController {
  private logger = new Logger(WatchlistTvsController.name);

  constructor(
    private readonly watchlistTvsService: WatchlistTvsService,
  ) {}

  @Post()
  async addWatchlistTv(
    @Body() addTvDto: AddTvDto,
    @GetUser() user: User,
  ): Promise<any> {
    return this.watchlistTvsService.addWatchlistTv(addTvDto, user);
  }
}
