import { Controller, Get, Post } from '@nestjs/common';
import { Authentication, CognitoUser, User } from '@nestjs-cognito/auth';

import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { RolesEnum } from './enums/roles.enum';
import { CurrentUser } from './decorators/current-user.decorator';
import { User as UserEntity } from '../user/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('profile')
  @Auth(RolesEnum.admin, RolesEnum.superUser)
  getProfile(@CurrentUser() currentUser: UserEntity) {
    return { ...currentUser };
  }

  @Post('ensure-user')
  @Authentication()
  ensureUser(@CognitoUser() user: User) {
    return this.authService.ensureUser(user);
  }
}
