import { ConfigService } from '@nestjs/config';

import { PrismaService } from './prisma.service';

jest.mock('@prisma/adapter-pg', () => {
  return {
    PrismaPg: jest.fn().mockImplementation(() => ({
      provider: 'postgres',
      adapterName: '@prisma/adapter-pg',
    })),
  };
});

jest.mock('pg', () => {
  return {
    Pool: jest.fn().mockImplementation(() => ({
      end: jest.fn().mockResolvedValue(undefined),
    })),
  };
});

describe('PrismaService', () => {
  let service: PrismaService;
  let configService: { get: jest.Mock };

  beforeEach(() => {
    configService = {
      get: jest.fn().mockReturnValue('postgresql://postgres:postgres@localhost:5432/test'),
    };

    service = new PrismaService(configService as unknown as ConfigService);
    service.$connect = jest.fn().mockResolvedValue(undefined);
    service.$disconnect = jest.fn().mockResolvedValue(undefined);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw error when DATABASE_URL is missing', () => {
    configService.get.mockReturnValue(undefined);
    expect(() => new PrismaService(configService as unknown as ConfigService)).toThrow(
      'DATABASE_URL environment variable is not defined in .env',
    );
  });

  it('should connect on onModuleInit', async () => {
    await service.onModuleInit();
    expect(service.$connect).toHaveBeenCalled();
  });

  it('should disconnect and close pool on onModuleDestroy', async () => {
    await service.onModuleDestroy();
    expect(service.$disconnect).toHaveBeenCalled();
  });
});
