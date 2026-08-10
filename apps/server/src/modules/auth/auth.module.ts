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
        // JWT_SECRET and JWT_EXPIRES_IN are guaranteed to exist by Zod env validation in AppModule.
        const secret = configService.get<string>('JWT_SECRET')!;
        const expiresIn = configService.get<string>('JWT_EXPIRES_IN')!;
        return {
          secret,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
          signOptions: { expiresIn: expiresIn as any },
        };
      },
    }),
  ],
  providers: [AuthService, JwtStrategy, PasswordService],
  controllers: [AuthController],
})
export class AuthModule {}
