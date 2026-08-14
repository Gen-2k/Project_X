import { Test, TestingModule } from '@nestjs/testing';

import { PasswordService } from './password.service';

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
    await service.onModuleInit();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('hashPassword & comparePassword', () => {
    it('should hash a password and verify it matches the raw password', async () => {
      const password = 'superSecretPassword123!';
      const hash = await service.hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toEqual(password);
      expect(hash.startsWith('$2')).toBe(true);

      const isMatch = await service.comparePassword(password, hash);
      expect(isMatch).toBe(true);
    });

    it('should return false when comparing password with incorrect hash', async () => {
      const password = 'superSecretPassword123!';
      const wrongPassword = 'wrongPassword456!';
      const hash = await service.hashPassword(password);

      const isMatch = await service.comparePassword(wrongPassword, hash);
      expect(isMatch).toBe(false);
    });
  });

  describe('mitigateTimingAttack', () => {
    it('should execute comparison against dummy hash without error', async () => {
      await expect(service.mitigateTimingAttack('randomAttemptedPassword')).resolves.not.toThrow();
    });
  });
});
