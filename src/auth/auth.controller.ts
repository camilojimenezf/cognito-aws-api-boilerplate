import { Controller, Get } from '@nestjs/common';
import { Authentication, CognitoUser, User } from '@nestjs-cognito/auth';

import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { RolesEnum } from './enums/roles.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('profile')
  @Authentication()
  getProfile(@CognitoUser() user: User) {
    return { email: user.email };
  }

  @Get('profile2')
  @Auth(RolesEnum.admin, RolesEnum.superUser)
  getProfile2(@CognitoUser() user: User) {
    return { email: user.email };
  }
}
