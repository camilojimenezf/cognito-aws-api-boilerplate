import { Module } from '@nestjs/common';
import { CognitoAuthModule } from '@nestjs-cognito/auth';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { env } from '../config/env';
import { UserModule } from '../user/user.module';
import { User } from '../user/entities/user.entity';
import { Role } from '../user/entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    CognitoAuthModule.register({
      jwtVerifier: {
        userPoolId: env.COGNITO_USER_POOL_ID,
        clientId: env.COGNITO_CLIENT_ID,
        tokenUse: 'id',
      },
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [CognitoAuthModule],
})
export class AuthModule {}
