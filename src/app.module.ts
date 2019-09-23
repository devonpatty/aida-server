import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { MoviesModule } from './movies/movies.module';
import { WatchlistMoviesModule } from './watchlist-movies/watchlist-movies.module';
import { AuthModule } from './auth/auth.module';
import { WatchlistTvsModule } from './watchlist-tvs/watchlist-tvs.module';
import { TvsModule } from './tvs/tvs.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    MoviesModule,
    WatchlistMoviesModule,
    AuthModule,
    WatchlistTvsModule,
    TvsModule,
  ],
})
export class AppModule {}
