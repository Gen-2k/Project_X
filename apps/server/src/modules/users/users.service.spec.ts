import { PrismaService } from '@database/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import type { User } from '@project/database';

import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: {
    user: {
      findUnique: jest.Mock;
      create: jest.Mock;
    };
  };

  const mockUser: User = {
    id: '01912345-6789-7abc-def0-123456789abc',
    email: 'test@example.com',
    passwordHash: '$2b$10$hashedpassword',
    name: 'Test User',
    avatarUrl: null,
    createdAt: new Date('2026-08-14T00:00:00.000Z'),
  };

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user when found by email', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findOne('test@example.com');
      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should return null when user is not found by email', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const result = await service.findOne('notfound@example.com');
      expect(result).toBeNull();
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'notfound@example.com' },
      });
    });
  });

  describe('create', () => {
    it('should create and return a new user', async () => {
      const createInput = {
        email: 'new@example.com',
        passwordHash: '$2b$10$newhashedpassword',
        name: 'New User',
      };

      prisma.user.create.mockResolvedValue({
        ...mockUser,
        ...createInput,
      });

      const result = await service.create(createInput);
      expect(result.email).toBe('new@example.com');
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: createInput,
      });
    });
  });

  describe('findById', () => {
    it('should return a user when found by id', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findById(mockUser.id);
      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
    });

    it('should return null when user is not found by id', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const result = await service.findById('non-existent-id');
      expect(result).toBeNull();
    });
  });
});
