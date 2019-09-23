import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { WatchlistTv } from "./watchlist-tv.entity";

@Entity()
export class Tv extends BaseEntity {
  @PrimaryGeneratedColumn()
  tvId: number;

  @Column({ unique: true })
  exTvId: number;

  @Column()
  title: string;

  @Column()
  overview: string;

  @Column()
  posterPath: string;

  @Column()
  releaseDate: string;

  @OneToMany(() => WatchlistTv, watchlistTv => watchlistTv.tv)
  watchlistTv: WatchlistTv[];
}