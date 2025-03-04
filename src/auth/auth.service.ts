import { User } from '@nestjs-cognito/auth';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User as UserEntity } from '../user/entities/user.entity';
import { Role } from '../user/entities/role.entity';
import { RolesEnum } from './enums/roles.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async ensureUser(user: User) {
    const userDB = await this.userRepository.findOne({
      where: { email: user.email },
    });

    if (userDB) {
      return userDB;
    }

    const role = await this.roleRepository.findOne({
      where: { name: RolesEnum.user },
    });

    if (!role) {
      throw new InternalServerErrorException(
        'Default role not found, please contact support',
      );
    }

    const newUser = this.userRepository.create({
      email: user.email,
      roles: [role],
    });

    return this.userRepository.save(newUser);
  }
}
