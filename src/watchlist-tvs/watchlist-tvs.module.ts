import { Module } from '@nestjs/common';
import { WatchlistTvsController } from './watchlist-tvs.controller';
import { WatchlistTvsService } from './watchlist-tvs.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WatchlistTvRepository } from './watchlist-tvs.repository';
import { TvRepository } from '../tvs/tvs.repository';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([WatchlistTvRepository, TvRepository]),
  ],
  controllers: [WatchlistTvsController],
  providers: [WatchlistTvsService]
})
export class WatchlistTvsModule {}
