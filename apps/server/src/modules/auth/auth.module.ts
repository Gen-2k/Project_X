import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
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
      useFactory: (configService: ConfigService): JwtModuleOptions => {
        // JWT_SECRET and JWT_EXPIRES_IN are guaranteed to exist by Zod env validation in AppModule.
        const secret = configService.get<string>('JWT_SECRET')!;
        const expiresIn = configService.get<string>('JWT_EXPIRES_IN')!;
        return {
          secret,
          signOptions: {
            expiresIn: (expiresIn || '1d') as '1d',
          },
        };
      },
    }),
  ],
  providers: [AuthService, JwtStrategy, PasswordService],
  controllers: [AuthController],
})
export class AuthModule {}
