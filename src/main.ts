import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { HttpErrorFilter } from './common/shared/http-error.filter';
import { LoggingInterceptor } from './common/shared/logging.interceptor';

import * as helmet from 'helmet';
import * as config from 'config';

async function bootstrap() {
  const serverConfig = config.get('server');
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  
  if (process.env.NODE_ENV === 'development') {
    app.enableCors();
  } else {
    app.enableCors({ origin: serverConfig.origin });
    logger.log(`origin: ${serverConfig.origin}`);
  }
  
  app.use(helmet());
  app.useGlobalFilters(new HttpErrorFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());


  const port = process.env.PORT || serverConfig.port;
  await app.listen(port);
  logger.log(`Application listening on ${port}`);
}
bootstrap();
