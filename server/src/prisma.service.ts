import { Injectable, OnModuleInit } from '@nestjs/common';
// Import from the output directory configured in schema.prisma
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor() {
        // Set up postgres connection pool using your .env DATABASE_URL
        const pool = new Pool({ connectionString: process.env.DATABASE_URL });
        const adapter = new PrismaPg(pool);

        // Pass adapter to Prisma Client constructor
        super({ adapter });
    }

    async onModuleInit() {
        await this.$connect();
    }
}
