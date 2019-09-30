import { EntityRepository, Repository } from "typeorm";
import { Tv } from "../entities/tv.entity";
import { Logger, InternalServerErrorException } from "@nestjs/common";
import { AddTvDto } from "./dto/add-tv.dto";

@EntityRepository(Tv)
export class TvRepository extends Repository<Tv> {
  private readonly logger = new Logger(TvRepository.name);

  async addTv(addTvDto: AddTvDto): Promise<Tv> {
    const { exTvId, title, overview, posterPath, releaseDate } = addTvDto;
    const query = this.createQueryBuilder();

    const tv = new Tv();
    tv.exTvId = exTvId;
    tv.title = title;
    tv.overview = overview;
    tv.posterPath = posterPath;
    tv.releaseDate = releaseDate;

    try {
      await query
        .insert()
        .into(Tv)
        .values(tv)
        .onConflict(`("exTvId") DO NOTHING`)
        .execute();
    } catch (error) {
      this.logger.error(`${error.code}`, error.stack);
      throw new InternalServerErrorException();
    }

    return tv;
  }

  async checkIfTvExists(addTvDto: AddTvDto): Promise<boolean> {
    const query = this.createQueryBuilder('tv');

    const { exTvId } = addTvDto;

    query.where('tv.exTvId = :exTvId', { exTvId });

    try {
      const exists = await query.getOne();
      return exists ? true : false;
    } catch (error) {
      // some error handling here...
    }
  }
}