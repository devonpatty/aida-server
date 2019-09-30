import { EntityRepository, Repository } from "typeorm";
import { Tv } from "../entities/tv.entity";
import { Logger, InternalServerErrorException } from "@nestjs/common";
import { AddTvDto } from "../tvs/dto/add-tv.dto";
import { WatchlistTv } from "../entities/watchlist-tv.entity";
import { User } from "../entities/user.entity";

@EntityRepository(WatchlistTv)
export class WatchlistTvRepository extends Repository<WatchlistTv> {
  private logger = new Logger(WatchlistTvRepository.name);

  async getWatchlistTv(user: User): Promise<WatchlistTv[]> {
    const query = this.createQueryBuilder('watchlisttvs');

    query.where('watchlisttvs.userId = :userId', { userId: user.userId });
    query.leftJoinAndSelect('watchlisttvs.tv', 'tv');

    try {
      const tv = await query.getMany();
      return tv;
    } catch (error) {
      this.logger.error(`Failed to get tv`, error.stack);
      throw new InternalServerErrorException();
    }
  }

  // also check for exEpisodeId and seasonNumber
  async checkIfUserWatchedTv(addTvDto: AddTvDto, user: User): Promise<boolean> {
    const { exTvId, exSeasonId, exEpisodeId, seasonNumber } = addTvDto;
    const { userId } = user;
    const query = this.createQueryBuilder('watchlisttv');

    // too many checking ??
    query
      .leftJoinAndSelect('watchlisttv.tv', 'tv')
      .where('watchlisttv.exTvId = :exTvId', { exTvId })
      .andWhere('watchlisttv.userId = :userId', { userId })
      .andWhere('watchlisttv.exSeasonId = :exSeasonId', { exSeasonId})
      .andWhere('watchlisttv.exEpisodeId = :exEpisodeId', { exEpisodeId })
      .andWhere('watchlisttv.seasonNumber = :seasonNumber', { seasonNumber });

    try {
      const exists = await query.getOne();
      return exists ? true : false;
    } catch (error) {
      // some error handling here...
    }
  }

  async addWatchlistTv(
    addTvDto: AddTvDto,
    user: User,
  ): Promise<any> {
    const { exTvId, exSeasonId, seasonNumber, exEpisodeId } = addTvDto;
    
  
    const watchlistTv = new WatchlistTv();
    watchlistTv.hasWatched = true;
    watchlistTv.addedDate = new Date();
    watchlistTv.exTvId = exTvId;
    watchlistTv.exSeasonId = exSeasonId;
    watchlistTv.seasonNumber = seasonNumber;
    watchlistTv.exEpisodeId = exEpisodeId;
    watchlistTv.user = user;
    
    try {
      await watchlistTv.save();
    } catch (error) {
      this.logger.error(`Failed to create watchlist ${error.code}`, error.stack);
      throw new InternalServerErrorException();
    }

    delete watchlistTv.user;

    return watchlistTv;
  }
}