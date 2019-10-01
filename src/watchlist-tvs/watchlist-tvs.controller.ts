import { Controller, Logger, Post, Body, UseGuards, Get, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { WatchlistTvsService } from './watchlist-tvs.service';
import { AddTvDto } from '../tvs/dto/add-tv.dto';
import { GetUser } from '../auth/deco/get-user.decorator';
import { User } from '../entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { WatchlistTv } from "../entities/watchlist-tv.entity";
import { WatchlistTvDto } from './dto/watchlist-tv.dto';

@Controller('watchlisttvs')
@UseGuards(AuthGuard())
export class WatchlistTvsController {
  private logger = new Logger(WatchlistTvsController.name);

  constructor(
    private readonly watchlistTvsService: WatchlistTvsService,
  ) {}

  @Get()
  async getWatchlistTv(
    @Query('page', ParseIntPipe) page: number,
    @GetUser() user: User
  ): Promise<WatchlistTv[]> {
    return this.watchlistTvsService.getWatchlistTv(user, page);
  }

  @Post()
  async addWatchlistTv(
    @Body() addTvDto: AddTvDto,
    @GetUser() user: User,
  ): Promise<any> {
    return this.watchlistTvsService.addWatchlistTv(addTvDto, user);
  }

  @Delete()
  async deleteWatchlistTv(
    @Body() watchlistTvDto: WatchlistTvDto,
    @GetUser() user: User,
  ): Promise<any> {
    return this.watchlistTvsService.deleteWatchlistTv(user, watchlistTvDto);
  }
}
