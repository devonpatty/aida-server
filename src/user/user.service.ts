import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from '../entities/user.entity';
import { UserPassCredentials } from './dto/user-pass-credentials.dto';
import { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async changePassword(
    user: User,
    userPassCredentials: UserPassCredentials,
  ): Promise<any> {
    const { currentPassword, newPassword } = userPassCredentials;

    if (currentPassword === newPassword) {
      // password cant be the same
      console.log('cant use the same password');
    }

    const userData: AuthCredentialsDto = { 
      username: user.username,
      password: currentPassword
    };

    const checkPassword = await this.userRepository.validateUserPassword(userData);
    if (!checkPassword) {
      // password not match
      console.log(`checkPassword not match`);
    }

    // if password match change password
    const result = await this.userRepository.changePassword(user, newPassword, checkPassword.salt);
  }

  async findUser(userId: number): Promise<User> {
    return await this.userRepository.findOne({ userId });
  }
}
