import { applyDecorators, UseGuards } from '@nestjs/common';
import { Authentication } from '@nestjs-cognito/auth';

import { UserRoleGuard } from '../guards/user-role.guard';

import { RoleProtected } from './role-protected.decorator';
import { RolesEnum } from '../enums/roles.enum';

export function Auth(...roles: RolesEnum[]) {
  return applyDecorators(
    RoleProtected(...roles),
    Authentication(),
    UseGuards(UserRoleGuard),
  );
}
