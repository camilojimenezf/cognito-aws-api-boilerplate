import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { env } from './config/env';
import { SeedModule } from './seed/seed.module';
import { InitializationModule } from './initialization/initialization.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: env.DB_HOST,
      port: env.DB_PORT,
      database: env.DB_NAME,
      username: env.DB_USERNAME,
      password: env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
      ssl: env.DB_SSL ? { rejectUnauthorized: false } : false,
    }),
    AuthModule,
    UserModule,
    SeedModule,
    InitializationModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
