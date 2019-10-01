import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WatchlistTvRepository } from './watchlist-tvs.repository';
import { AddTvDto } from '../tvs/dto/add-tv.dto';
import { User } from '../entities/user.entity';
import { WatchlistTv } from '../entities/watchlist-tv.entity';
import { TvRepository } from '../tvs/tvs.repository';
import { WatchlistTvDto } from './dto/watchlist-tv.dto';

@Injectable()
export class WatchlistTvsService {
  constructor(
    @InjectRepository(WatchlistTvRepository)
    private readonly watchlistTvRepository: WatchlistTvRepository,

    @InjectRepository(TvRepository)
    private readonly tvRepository: TvRepository,
  ) {}

  async getWatchlistTv(user: User, page: number): Promise<WatchlistTv[]> {
    const watchlistTv = await this.watchlistTvRepository.getWatchlistTv(user, number);

    return watchlistTv;
  }

  // this is a test
  async addWatchlistTv(
    addTvDto: AddTvDto,
    user: User
  ): Promise<any> {
    const tvExists = await this.watchlistTvRepository.checkIfUserWatchedTv(addTvDto, user);

    if(!tvExists) {
      await this.tvRepository.addTv(addTvDto);
      const watchlist = await this.watchlistTvRepository.addWatchlistTv(addTvDto, user);
      return watchlist;
    } else {
      return { message: 'watched' };
    }
  }

  async deleteWatchlistTv(
    user: User,
    watchlistTvDto: WatchlistTvDto,
  ): Promise<any> {
    return this.watchlistTvRepository.deleteWatchlistTv(user, watchlistTvDto);
  }
}
