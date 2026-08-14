import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('mock-jwt-secret-min-32-chars-long-valid!'),
          },
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return user object with id and email for valid payload', () => {
      const payload = { sub: 'user-id-123', email: 'test@example.com' };
      const result = strategy.validate(payload);

      expect(result).toEqual({
        id: 'user-id-123',
        email: 'test@example.com',
      });
    });

    it('should throw UnauthorizedException when sub claim is missing or empty', () => {
      expect(() => strategy.validate({ sub: '', email: 'test@example.com' })).toThrow(
        new UnauthorizedException('Invalid token payload'),
      );
      expect(() =>
        strategy.validate({ sub: undefined as unknown as string, email: 'test@example.com' }),
      ).toThrow(new UnauthorizedException('Invalid token payload'));
    });
  });
});
