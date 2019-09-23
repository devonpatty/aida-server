import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { WatchlistMovie } from "./watchlist-movies.entity";

@Entity()
export class Movie extends BaseEntity {
  @PrimaryGeneratedColumn()
  movieId: number;

  @Column({ unique: true })
  exMovieId: number;

  @Column()
  title: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  overview: string;

  @Column({ nullable: true })
  posterPath: string;

  @Column()
  releaseDate: string;

  @OneToMany(() => WatchlistMovie, watchlistMovie => watchlistMovie.movie, { eager: true })
  watchlistMovie: WatchlistMovie[];
}