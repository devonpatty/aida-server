import { Module, HttpModule } from '@nestjs/common';
import { TvsController } from './tvs.controller';
import { TvsService } from './tvs.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
  ],
  controllers: [TvsController],
  providers: [TvsService]
})
export class TvsModule {}
