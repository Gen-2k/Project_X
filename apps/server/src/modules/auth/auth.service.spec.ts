import { UsersService } from '@modules/users/users.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@project/database';

import { AuthService } from './auth.service';
import { PasswordService } from './password.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: {
    findOne: jest.Mock;
    create: jest.Mock;
    findById: jest.Mock;
  };
  let jwtService: {
    sign: jest.Mock;
  };
  let passwordService: {
    hashPassword: jest.Mock;
    comparePassword: jest.Mock;
    mitigateTimingAttack: jest.Mock;
  };

  const mockUser = {
    id: '01912345-6789-7abc-def0-123456789abc',
    email: 'test@example.com',
    passwordHash: '$2b$10$hashedpassword',
    name: 'Test User',
    avatarUrl: null,
    createdAt: new Date('2026-08-14T00:00:00.000Z'),
  };

  beforeEach(async () => {
    usersService = {
      findOne: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('mocked.jwt.token'),
    };

    passwordService = {
      hashPassword: jest.fn().mockResolvedValue('$2b$10$hashedpassword'),
      comparePassword: jest.fn(),
      mitigateTimingAttack: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
        { provide: PasswordService, useValue: passwordService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const registerDto = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    };

    it('should successfully register a new user and return tokens', async () => {
      usersService.findOne.mockResolvedValue(null);
      usersService.create.mockResolvedValue(mockUser);

      const result = await service.register(registerDto);

      expect(usersService.findOne).toHaveBeenCalledWith('test@example.com');
      expect(passwordService.hashPassword).toHaveBeenCalledWith('password123');
      expect(usersService.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        name: 'Test User',
        passwordHash: '$2b$10$hashedpassword',
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
      expect(result).toEqual({
        access_token: 'mocked.jwt.token',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
        },
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      usersService.findOne.mockResolvedValue(mockUser);

      await expect(service.register(registerDto)).rejects.toThrow(
        new ConflictException('Email already exists'),
      );
      expect(usersService.create).not.toHaveBeenCalled();
    });

    it('should throw ConflictException if Prisma P2002 unique constraint is violated during creation', async () => {
      usersService.findOne.mockResolvedValue(null);
      const prismaError = new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: '7.9.1',
      });
      usersService.create.mockRejectedValue(prismaError);

      await expect(service.register(registerDto)).rejects.toThrow(
        new ConflictException('Email already exists'),
      );
    });

    it('should rethrow unexpected errors during creation', async () => {
      usersService.findOne.mockResolvedValue(null);
      const genericError = new Error('Database connection failure');
      usersService.create.mockRejectedValue(genericError);

      await expect(service.register(registerDto)).rejects.toThrow(genericError);
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should successfully authenticate user with valid credentials', async () => {
      usersService.findOne.mockResolvedValue(mockUser);
      passwordService.comparePassword.mockResolvedValue(true);

      const result = await service.login(loginDto);

      expect(usersService.findOne).toHaveBeenCalledWith('test@example.com');
      expect(passwordService.comparePassword).toHaveBeenCalledWith(
        'password123',
        mockUser.passwordHash,
      );
      expect(result).toEqual({
        access_token: 'mocked.jwt.token',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
        },
      });
    });

    it('should mitigate timing attack and throw UnauthorizedException when user does not exist', async () => {
      usersService.findOne.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );
      expect(passwordService.mitigateTimingAttack).toHaveBeenCalledWith('password123');
      expect(passwordService.comparePassword).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
      usersService.findOne.mockResolvedValue(mockUser);
      passwordService.comparePassword.mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );
    });
  });

  describe('getProfile', () => {
    it('should return user profile when user exists', async () => {
      usersService.findById.mockResolvedValue(mockUser);

      const result = await service.getProfile(mockUser.id);
      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
      });
      expect(usersService.findById).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw UnauthorizedException when user does not exist', async () => {
      usersService.findById.mockResolvedValue(null);

      await expect(service.getProfile('non-existent-id')).rejects.toThrow(
        new UnauthorizedException('User not found'),
      );
    });
  });
});
