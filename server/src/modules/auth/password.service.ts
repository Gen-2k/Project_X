import { Injectable, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService implements OnModuleInit {
  private dummyHash!: string;

  async onModuleInit(): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    this.dummyHash = await bcrypt.hash('dummy', salt);
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async mitigateTimingAttack(password: string): Promise<void> {
    await bcrypt.compare(password, this.dummyHash);
  }
}
