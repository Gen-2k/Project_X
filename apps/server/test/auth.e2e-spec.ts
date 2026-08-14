import { PrismaService } from '@database/prisma.service';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { App } from 'supertest/types';

import { AppModule } from '../src/app.module';

function getCookies(res: request.Response): string[] {
  const setCookie: unknown = res.headers['set-cookie'];
  if (Array.isArray(setCookie)) {
    return setCookie as string[];
  }
  if (typeof setCookie === 'string') {
    return [setCookie];
  }
  return [];
}

describe('AuthController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  const testUser = {
    email: `e2e_test_${Date.now()}@example.com`,
    password: 'securePassword123!',
    name: 'E2E Test User',
  };

  let authCookie: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.setGlobalPrefix('api/v1');
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    // Clean up test user created during suite
    try {
      await prisma.user.deleteMany({
        where: { email: { contains: 'e2e_test_' } },
      });
    } catch {
      // ignore cleanup error if db is teardown
    }
    await app.close();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user and set JWT cookie', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(testUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.user.name).toBe(testUser.name);
      expect(response.body.message).toBe('Registration successful');

      const cookies = getCookies(response);
      expect(cookies.length).toBeGreaterThan(0);
      expect(cookies[0]).toMatch(/jwt=[^;]+/);
      expect(cookies[0]).toMatch(/HttpOnly/i);
    });

    it('should reject registration when email is already registered (409 Conflict)', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(testUser);

      expect(response.status).toBe(409);
      expect(response.body.message).toBe('Email already exists');
    });

    it('should reject invalid registration input with 400 Bad Request', async () => {
      const response = await request(app.getHttpServer()).post('/api/v1/auth/register').send({
        email: 'invalid-email-address',
        password: '123', // less than 6 chars
        name: '',
      });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should authenticate user with valid credentials and return JWT cookie', async () => {
      const response = await request(app.getHttpServer()).post('/api/v1/auth/login').send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(response.status).toBe(200);
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.message).toBe('Login successful');

      const cookies = getCookies(response);
      expect(cookies.length).toBeGreaterThan(0);
      authCookie = (cookies[0] ?? '').split(';')[0] ?? '';
      expect(authCookie).toMatch(/^jwt=/);
    });

    it('should reject login with incorrect password (401 Unauthorized)', async () => {
      const response = await request(app.getHttpServer()).post('/api/v1/auth/login').send({
        email: testUser.email,
        password: 'wrongPassword999!',
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should reject login with non-existent email (401 Unauthorized)', async () => {
      const response = await request(app.getHttpServer()).post('/api/v1/auth/login').send({
        email: 'nonexistent_user_12345@example.com',
        password: 'somePassword123!',
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid credentials');
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('should return user profile when authenticated with cookie', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/auth/me')
        .set('Cookie', authCookie);

      expect(response.status).toBe(200);
      expect(response.body.email).toBe(testUser.email);
      expect(response.body.name).toBe(testUser.name);
    });

    it('should reject unauthenticated request without cookie (401 Unauthorized)', async () => {
      const response = await request(app.getHttpServer()).get('/api/v1/auth/me');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('should clear authentication cookie on logout', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/logout')
        .set('Cookie', authCookie);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Logout successful');

      const cookies = getCookies(response);
      expect(cookies.length).toBeGreaterThan(0);
      expect(cookies[0]).toMatch(/jwt=;/);
    });
  });
});
