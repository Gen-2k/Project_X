import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { PasswordService } from './password.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error('JWT_SECRET environment variable is not defined in .env');
        }
        const expiresIn = configService.get<string>('JWT_EXPIRES_IN');
        if (!expiresIn) {
          throw new Error(
            'JWT_EXPIRES_IN environment variable is not defined in .env (e.g. JWT_EXPIRES_IN=1d)',
          );
        }
        return {
          secret,
          signOptions: { expiresIn: expiresIn as never },
        };
      },
    }),
  ],
  providers: [AuthService, JwtStrategy, PasswordService],
  controllers: [AuthController],
})
export class AuthModule {}
