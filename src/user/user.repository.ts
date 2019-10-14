import { User } from "../entities/user.entity";
import { Repository, EntityRepository } from "typeorm";
import { AuthCredentialsDto } from "../auth/dto/auth-credentials.dto";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcryptjs';
import { AuthFormDto } from "../auth/dto/auth-form.dto";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(
    authFormDto: AuthFormDto,
  ): Promise<void> {
    const { username, password, email } = authFormDto;

    const user = new User();
    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    user.email = email;

    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') { // duplicate username
        throw new ConflictException('Username already exists');
      } else {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }

  async changePassword(user: User, password: string, salt: string): Promise<any> {
    const query = this.createQueryBuilder('user');

    const newPassword = await this.hashPassword(password, salt);

    await query
      .update(user)
      .set({ password: newPassword })
      .where("userId = :userId", { userId: user.userId })
      .execute();
    
    await this.incrementTokenVersion(user.userId);
  }

  async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<any> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({ username });

    const toResponse = {
      userId: user.userId,
      username: username,
      tokenVersion: user.tokenVersion,
      salt: user.salt,
    };

    if (user && await user.validatePassword(password)) {
      return toResponse;
    } else {
      return null;
    }
  }

  // TO DO implement incrementTokenVersion
  async incrementTokenVersion(userId: number): Promise<boolean> {
    await this.increment({ userId }, 'tokenVersion', 1);
    return true;
  }

  async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}