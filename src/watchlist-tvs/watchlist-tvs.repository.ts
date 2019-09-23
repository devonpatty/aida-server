import { EntityRepository, Repository } from "typeorm";
import { Tv } from "../entities/tv.entity";
import { Logger, InternalServerErrorException } from "@nestjs/common";
import { AddTvDto } from "../tvs/dto/add-tv.dto";
import { WatchlistTv } from "../entities/watchlist-tv.entity";
import { User } from "../entities/user.entity";

/**
 * reprogramm the watchlistTvEntity
 */

@EntityRepository(WatchlistTv)
export class WatchlistTvRepository extends Repository<WatchlistTv> {
  private logger = new Logger(WatchlistTvRepository.name);

  async addWatchlistTv(
    addTvDto: AddTvDto,
    user: User,
  ): Promise<any> {
    const { exTvId, title, overview, posterPath, releaseDate, exSeasonId, seasonNumber, exEpisodeId } = addTvDto;

    if (await this.validateTv(addTvDto)) {
      this.logger.error(`"${title}" exists in Tvs entity with exTvId: "${exTvId}" associated username: "${user.username}", userId: "${user.userId}"`);
      return { message: 'The Tv is already exists'};
    } else {
      const tv = new Tv();
      tv.exTvId = exTvId;
      tv.title = title;
      tv.overview = overview;
      tv.posterPath = posterPath;
      tv.releaseDate = releaseDate;
  
      const watchlistTv = new WatchlistTv();
      watchlistTv.hasWatched = true;
      watchlistTv.addedDate = new Date();
      watchlistTv.exSeasonId = exSeasonId;
      watchlistTv.seasonNumber = seasonNumber;
      watchlistTv.exEpisodeId = exEpisodeId;
      watchlistTv.user = user;
      watchlistTv.tv = tv;
      
      try {
        await tv.save();
        await watchlistTv.save();
      } catch (error) {
        this.logger.error(`Failed to create watchlist ${error.code}`, error.stack);
        throw new InternalServerErrorException();
      }
  
      delete watchlistTv.user;
  
      return watchlistTv;
    }
  }

  async validateTv(addTvDto: AddTvDto): Promise<boolean> {
    const { exTvId } = addTvDto;
    const query = this.createQueryBuilder('watchlisttv');

    query.leftJoinAndSelect('watchlisttv.tv', 'tv')
            .where('watchlisttv.exTvId = :exTvId', { exTvId });

    const tv = await query.getOne();
    if (tv) {
      return true;
    }
    return false;
  }
}