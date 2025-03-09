import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InitializationService } from './initialization.service';
import { Role } from '../user/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  providers: [InitializationService],
  exports: [InitializationService],
})
export class InitializationModule {}
