import { Module } from '@nestjs/common';
import { CognitoAuthModule } from '@nestjs-cognito/auth';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { env } from '../config/env';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
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
