import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import type { Request, Response } from 'express';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: {
    register: jest.Mock;
    login: jest.Mock;
    getProfile: jest.Mock;
  };
  let configService: {
    get: jest.Mock;
  };

  const mockUser = {
    id: '01912345-6789-7abc-def0-123456789abc',
    email: 'test@example.com',
    name: 'Test User',
  };

  beforeEach(async () => {
    authService = {
      register: jest.fn(),
      login: jest.fn(),
      getProfile: jest.fn(),
    };

    configService = {
      get: jest.fn((key: string) => {
        const configMap: Record<string, string> = {
          NODE_ENV: 'development',
          COOKIE_SECURE: 'false',
          JWT_EXPIRES_IN: '1d',
        };
        return configMap[key];
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register user, set jwt cookie, and return auth response', async () => {
      authService.register.mockResolvedValue({
        access_token: 'valid.token',
        user: mockUser,
      });

      const mockResponse = {
        cookie: jest.fn(),
      } as unknown as Response;

      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const result = await controller.register(registerDto, mockResponse);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(mockResponse.cookie).toHaveBeenCalledWith('jwt', 'valid.token', {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
      });
      expect(result).toEqual({
        user: mockUser,
        message: 'Registration successful',
      });
    });
  });

  describe('login', () => {
    it('should login user, set jwt cookie, and return auth response', async () => {
      authService.login.mockResolvedValue({
        access_token: 'valid.token',
        user: mockUser,
      });

      const mockResponse = {
        cookie: jest.fn(),
      } as unknown as Response;

      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = await controller.login(loginDto, mockResponse);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(mockResponse.cookie).toHaveBeenCalledWith('jwt', 'valid.token', {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
      });
      expect(result).toEqual({
        user: mockUser,
        message: 'Login successful',
      });
    });
  });

  describe('logout', () => {
    it('should clear jwt cookie and return logout message', () => {
      const mockResponse = {
        clearCookie: jest.fn(),
      } as unknown as Response;

      const result = controller.logout(mockResponse);

      expect(mockResponse.clearCookie).toHaveBeenCalledWith('jwt', {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
      });
      expect(result).toEqual({ message: 'Logout successful' });
    });
  });

  describe('getProfile', () => {
    it('should extract req.user.id and fetch profile from authService', async () => {
      authService.getProfile.mockResolvedValue(mockUser);

      const mockRequest = {
        user: { id: mockUser.id },
      } as unknown as Request;

      const result = await controller.getProfile(mockRequest);

      expect(authService.getProfile).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(mockUser);
    });
  });

  describe('cookie configuration and expiration parsing', () => {
    it('should handle production environment with default secure flag', async () => {
      configService.get.mockImplementation((key: string) => {
        if (key === 'NODE_ENV') return 'production';
        if (key === 'JWT_EXPIRES_IN') return '15m';
        return undefined;
      });

      authService.login.mockResolvedValue({
        access_token: 'prod.token',
        user: mockUser,
      });

      const mockResponse = { cookie: jest.fn() } as unknown as Response;
      await controller.login({ email: 'test@example.com', password: 'password' }, mockResponse);

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'jwt',
        'prod.token',
        expect.objectContaining({
          secure: true,
          maxAge: 15 * 60 * 1000,
        }),
      );
    });

    it('should fall back to 1 day maxAge when JWT_EXPIRES_IN format is unparseable', async () => {
      configService.get.mockImplementation((key: string) => {
        if (key === 'NODE_ENV') return 'development';
        if (key === 'JWT_EXPIRES_IN') return 'invalid-duration-format';
        return undefined;
      });

      authService.login.mockResolvedValue({
        access_token: 'fallback.token',
        user: mockUser,
      });

      const mockResponse = { cookie: jest.fn() } as unknown as Response;
      await controller.login({ email: 'test@example.com', password: 'password' }, mockResponse);

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'jwt',
        'fallback.token',
        expect.objectContaining({
          maxAge: 24 * 60 * 60 * 1000,
        }),
      );
    });

    it('should throw error when NODE_ENV is missing', () => {
      configService.get.mockReturnValue(undefined);

      const mockResponse = { clearCookie: jest.fn() } as unknown as Response;
      expect(() => controller.logout(mockResponse)).toThrow(
        'NODE_ENV environment variable is not defined in .env',
      );
    });
  });
});
