import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { META_ROLES } from '../decorators/role-protected.decorator';
import { UserService } from '../../user/user.service';
import { User } from '../../user/entities/user.entity';

interface CognitoRequest extends Request {
  cognito_jwt_payload: { email: string };
  user: User;
}

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly usersService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const validRoles: string[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );

    const req = context.switchToHttp().getRequest<CognitoRequest>();
    const userEmail = req.cognito_jwt_payload.email;

    // Note: to reduce latency, we can use a cache to store the user data fetched by email
    const user = await this.usersService.findByEmail(userEmail);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    req.user = user;

    const roles = user.roles.map((role) => role.name);

    if (!validRoles || validRoles.length === 0) return true; // If no roles are required, allow access

    if (!roles || roles.length === 0) {
      throw new ForbiddenException(
        `User ${user.email} does not have any roles`,
      );
    }

    for (const role of user.roles) {
      if (validRoles.includes(role.name)) {
        return true;
      }
    }

    throw new ForbiddenException(
      `User ${user.email} does not have a valid role, valid roles are: ${validRoles.join(', ')}`,
    );
  }
}
