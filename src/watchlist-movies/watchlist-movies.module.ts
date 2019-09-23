import { Module } from '@nestjs/common';
import { WatchlistMoviesController } from './watchlist-movies.controller';
import { WatchlistMoviesService } from './watchlist-movies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WatchlistMovieRepository } from './watchlist-movies.reporitory';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([WatchlistMovieRepository]),
  ],
  controllers: [WatchlistMoviesController],
  providers: [WatchlistMoviesService]
})
export class WatchlistMoviesModule {}
