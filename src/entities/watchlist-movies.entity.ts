import { Entity, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Movie } from "./movie.entity";
import { User } from "./user.entity";

@Entity()
export class WatchlistMovie extends BaseEntity {
  @PrimaryGeneratedColumn()
  watchlistMovieId: number;

  @CreateDateColumn()
  addedDate: Date;

  @Column({ nullable: true })
  hasWatched: boolean;

  @ManyToOne(() => User, user => user.watchlistMovie)
  @JoinColumn({
    name: "userId",
    referencedColumnName: "userId"
  })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Movie, movie => movie.watchlistMovie)
  @JoinColumn({
    name: "exMovieId",
    referencedColumnName: "exMovieId"
  })
  movie: Movie;

  @Column()
  exMovieId: number;
}