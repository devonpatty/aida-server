import { Controller, Logger, Post, Body, UseGuards, Get } from '@nestjs/common';
import { WatchlistTvsService } from './watchlist-tvs.service';
import { AddTvDto } from '../tvs/dto/add-tv.dto';
import { GetUser } from '../auth/deco/get-user.decorator';
import { User } from '../entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { WatchlistTv } from "../entities/watchlist-tv.entity";

@Controller('watchlisttvs')
@UseGuards(AuthGuard())
export class WatchlistTvsController {
  private logger = new Logger(WatchlistTvsController.name);

  constructor(
    private readonly watchlistTvsService: WatchlistTvsService,
  ) {}

  @Get()
  async getWatchlistTv(@GetUser() user: User): Promise<WatchlistTv[]> {
    return this.watchlistTvsService.getWatchlistTv(user);
  }


  // need validation of tv seasonnumber and alsothe 
  @Post()
  async addWatchlistTv(
    @Body() addTvDto: AddTvDto,
    @GetUser() user: User,
  ): Promise<any> {
    return this.watchlistTvsService.addWatchlistTv(addTvDto, user);
  }
}
