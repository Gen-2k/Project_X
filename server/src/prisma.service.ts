import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// Import from the output directory configured in schema.prisma
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor(configService: ConfigService) {
        // Set up postgres connection pool using your .env DATABASE_URL
        const databaseUrl = configService.get<string>('DATABASE_URL');
        if (!databaseUrl) {
            throw new Error('DATABASE_URL environment variable is not defined');
        }
        
        const pool = new Pool({ connectionString: databaseUrl });
        const adapter = new PrismaPg(pool);

        // Pass adapter to Prisma Client constructor
        super({ adapter });
    }

    async onModuleInit() {
        await this.$connect();
    }
}
