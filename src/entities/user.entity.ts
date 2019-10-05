import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany, BeforeInsert } from "typeorm";
import * as bcrypt from 'bcryptjs';
import { WatchlistMovie } from "./watchlist-movies.entity";
import { WatchlistTv } from "./watchlist-tv.entity";

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;
  
  @Column()
  salt: string;

  @Column("int", { default: 0 })
  tokenVersion: number;

  @OneToMany(() => WatchlistMovie, watchlistMovie => watchlistMovie.user)
  watchlistMovie: WatchlistMovie[];

  @OneToMany(() => WatchlistTv, watchlistTv => watchlistTv.user)
  watchlistTv: WatchlistTv[];

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}