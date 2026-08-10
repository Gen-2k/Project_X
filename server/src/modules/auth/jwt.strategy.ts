import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is not defined in .env');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request): string | null => {
          return (request?.cookies as Record<string, string>)?.['jwt'] ?? null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  validate(payload: { sub: string; email: string }): { id: string; email: string } {
    return { id: payload.sub, email: payload.email };
  }
}
