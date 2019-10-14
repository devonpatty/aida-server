import { Controller, Patch, UseGuards, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/deco/get-user.decorator';
import { User } from '../entities/user.entity';
import { UserPassCredentials } from './dto/user-pass-credentials.dto';
import { UserService } from './user.service';

@Controller('profile')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Patch('/change_password')
  @UseGuards(AuthGuard('jwt'))
  async changePassword(
    @GetUser() user: User,
    @Body() userPassCredentials: UserPassCredentials,
  ): Promise<any> {
    return this.userService.changePassword(user, userPassCredentials);
  }
  
}
