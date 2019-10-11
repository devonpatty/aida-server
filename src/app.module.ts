import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { MoviesModule } from './movies/movies.module';
import { WatchlistMoviesModule } from './watchlist-movies/watchlist-movies.module';
import { AuthModule } from './auth/auth.module';
import { WatchlistTvsModule } from './watchlist-tvs/watchlist-tvs.module';
import { TvsModule } from './tvs/tvs.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { TokenModule } from './token/token.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    MoviesModule,
    WatchlistMoviesModule,
    AuthModule,
    WatchlistTvsModule,
    TvsModule,
    TokenModule,
    UserModule,
  ],
})
export class AppModule /*implements NestModule*/ {
  /*configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: 'movies/search', method: RequestMethod.GET })
  }*/
}
