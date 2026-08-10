import { PrismaService } from '@database/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  getHello(): string {
    return 'Welcome to the Project X Server';
  }
}
