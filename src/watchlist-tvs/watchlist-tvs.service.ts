import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WatchlistTvRepository } from './watchlist-tvs.repository';
import { AddTvDto } from '../tvs/dto/add-tv.dto';
import { User } from '../entities/user.entity';
import { WatchlistTv } from '../entities/watchlist-tv.entity';

@Injectable()
export class WatchlistTvsService {
  constructor(
    @InjectRepository(WatchlistTvRepository)
    private readonly watchlistTvRepository: WatchlistTvRepository,
  ) {}

  async getWatchlistTv(user: User): Promise<WatchlistTv[]> {
    const watchlistTv = await this.watchlistTvRepository.getWatchlistTv(user);

    return watchlistTv;
  }

  async addWatchlistTv(
    addTvDto: AddTvDto,
    user: User
  ): Promise<any> {
    return this.watchlistTvRepository.addWatchlistTv(addTvDto, user);
  }
}
