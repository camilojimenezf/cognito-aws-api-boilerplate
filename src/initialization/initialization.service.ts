import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../user/entities/role.entity';
import { RolesEnum } from '../auth/enums/roles.enum';

@Injectable()
export class InitializationService implements OnModuleInit {
  private readonly logger = new Logger('InitializationService');

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async onModuleInit() {
    await this.ensureDefaultRoles();
  }

  private async ensureDefaultRoles() {
    this.logger.log('Checking for default roles...');

    const rolesCount = await this.roleRepository.count();

    if (rolesCount === 0) {
      this.logger.log('No roles found. Creating default roles...');

      const defaultRoles = Object.values(RolesEnum).map((roleName) => {
        return this.roleRepository.create({ name: roleName });
      });

      await this.roleRepository.save(defaultRoles);

      this.logger.log(`Created ${defaultRoles.length} default roles`);
    } else {
      this.logger.log('Default roles already exist');
    }
  }
}
