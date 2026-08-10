import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
// Import from the output directory configured in schema.prisma
import { PrismaClient } from '@project/database';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly pool: Pool;

  constructor(configService: ConfigService) {
    // Set up postgres connection pool using your .env DATABASE_URL
    const databaseUrl = configService.get<string>('DATABASE_URL');
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not defined in .env');
    }

    const pool = new Pool({ connectionString: databaseUrl });
    const adapter = new PrismaPg(pool);

    // Pass adapter to Prisma Client constructor
    super({ adapter });

    this.pool = pool;
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    await this.pool.end();
  }
}
