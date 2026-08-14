import { HealthCheckService, PrismaHealthIndicator } from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../database/prisma.service';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;
  let healthService: { check: jest.Mock };
  let dbIndicator: { pingCheck: jest.Mock };
  let prismaService: PrismaService;

  beforeEach(async () => {
    healthService = {
      check: jest.fn((indicators) => Promise.all(indicators.map((fn: () => unknown) => fn()))),
    };

    dbIndicator = {
      pingCheck: jest.fn().mockResolvedValue({ database: { status: 'up' } }),
    };

    prismaService = {} as PrismaService;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: HealthCheckService, useValue: healthService },
        { provide: PrismaHealthIndicator, useValue: dbIndicator },
        { provide: PrismaService, useValue: prismaService },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('check', () => {
    it('should invoke db.pingCheck and return health status', async () => {
      const result = await controller.check();

      expect(healthService.check).toHaveBeenCalled();
      expect(dbIndicator.pingCheck).toHaveBeenCalledWith('database', prismaService);
      expect(result).toEqual([{ database: { status: 'up' } }]);
    });
  });
});
