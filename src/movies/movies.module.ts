import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { Module, HttpModule } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { HttpErrorFilter } from '../common/shared/http-error.filter';
import { LoggingInterceptor } from '../common/shared/logging.interceptor';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
  ],
  controllers: [MoviesController],
  providers: [MoviesService,
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    }
  ],
})
export class MoviesModule {}
