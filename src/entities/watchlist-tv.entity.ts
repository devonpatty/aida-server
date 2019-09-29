import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Tv } from "./tv.entity";
import { User } from "./user.entity";

@Entity()
export class WatchlistTv extends BaseEntity {
  @PrimaryGeneratedColumn()
  watchlistTvId: number;
  
  @CreateDateColumn()
  addedDate: Date;

  @Column({ nullable: true })
  hasWatched: boolean;

  @Column()
  exSeasonId: number;

  @Column()
  seasonNumber: number;

  @Column()
  exEpisodeId: number;

  @ManyToOne(() => Tv, tv => tv.watchlistTv)
  @JoinColumn({
    name: "exTvId",
    referencedColumnName: "exTvId",
  })
  tv: Tv;

  @Column()
  exTvId: number;

  @ManyToOne(() => User, user => user.watchlistTv)
  @JoinColumn({
    name: "userId",
    referencedColumnName: "userId"
  })
  user: User;

  @Column()
  userId: number;

/*
  @Column()
  userId: number;
*/
/*
  @ManyToOne(() => Season, season => season.watchlistTv)
  @JoinColumn({
    name: "exSeasonId",
    referencedColumnName: "exSeasonId",
  })
  season: Season;


  @ManyToOne(() => Episode, episode => episode.watchlistTv)
  @JoinColumn({
    name: "exEpisodeId",
    referencedColumnName: "exEpisodeId",
  })
  episode: Episode;
*/
}