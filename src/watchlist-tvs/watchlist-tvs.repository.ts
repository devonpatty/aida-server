import { EntityRepository, Repository } from "typeorm";
import { Tv } from "../entities/tv.entity";
import { Logger, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { AddTvDto } from "../tvs/dto/add-tv.dto";
import { WatchlistTv } from "../entities/watchlist-tv.entity";
import { User } from "../entities/user.entity";
import { WatchlistTvDto } from "./dto/watchlist-tv.dto";

@EntityRepository(WatchlistTv)
export class WatchlistTvRepository extends Repository<WatchlistTv> {
  private logger = new Logger(WatchlistTvRepository.name);

  async getWatchlistTv(user: User, page: number = 1): Promise<WatchlistTv[]> {
    const { userId } = user;

    try {
      const watchlistTv = await this.find({
        relations: ['tv'],
        where: { userId },
        order: {
          addedDate: "DESC", // newest first
        },
        take: 10,
        skip: 10 * (page - 1)
      });
      return watchlistTv;
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

  async deleteWatchlistTv(
    user: User,
    watchlistTvDto: WatchlistTvDto,
  ): Promise<any> {
    const { userId } = user;
    const { exTvId, exSeasonId, seasonNumber, exEpisodeId } = watchlistTvDto;
    const del = await this.delete({ userId, exTvId, exSeasonId, seasonNumber, exEpisodeId });

    if (del.affected === 0) {
      throw new NotFoundException();
    }

    return del;
  }
}