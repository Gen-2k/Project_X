import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) { }

  getHello(): string {
    return 'Welcome to the Project X Server';
  }

  // Fetch all users from PostgreSQL
  async getUsers() {
    return this.prisma.user.findMany();
  }

  // Create a new test user in PostgreSQL
  async createUser(email: string, name?: string) {
    return this.prisma.user.create({
      data: { email, name },
    });
  }
}
