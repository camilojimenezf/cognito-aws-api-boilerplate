import { ForbiddenException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { isDevelopment } from '../config/env';
import { User } from '../user/entities/user.entity';
import { Role } from '../user/entities/role.entity';
import { SEED_ROLES, SEED_USERS } from './data/seed-data';

@Injectable()
export class SeedService {
  private isDev: boolean;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {
    this.isDev = isDevelopment;
  }

  async executeSeed() {
    if (!this.isDev) {
      throw new ForbiddenException(
        'This action is only available in development',
      );
    }

    await this.deleteTables();
    const roles = await this.createRoles();
    const users = await this.createUsers();
    await this.assignRolesToUsers(users, roles);

    return 'This action runs the seed';
  }

  private async deleteTables() {
    const queryBuilderUser = this.userRepository.createQueryBuilder();
    await queryBuilderUser.delete().where({}).execute();

    const queryBuilderRole = this.roleRepository.createQueryBuilder();
    await queryBuilderRole.delete().where({}).execute();
  }

  private async createRoles(): Promise<Role[]> {
    const roles: Role[] = [];

    SEED_ROLES.forEach((seedRole) => {
      const roleDB = this.roleRepository.create({ name: seedRole.name });
      roles.push(roleDB);
    });

    return await this.roleRepository.save(roles);
  }

  private async createUsers(): Promise<User[]> {
    const users: User[] = [];

    SEED_USERS.forEach((seedUser) => {
      const userDB = this.userRepository.create({ email: seedUser.email });
      users.push(userDB);
    });

    return await this.userRepository.save(users);
  }

  private async assignRolesToUsers(users: User[], roles: Role[]) {
    for (const user of users) {
      const userToUpdate = await this.userRepository.findOne({
        where: { id: user.id },
      });

      if (userToUpdate) {
        userToUpdate.roles = roles;
        await this.userRepository.save(userToUpdate);
      }
    }
  }
}
