import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const corsOrigin = configService.get<string>('CORS_ORIGIN');
  if (!corsOrigin) {
    throw new Error(
      'CORS_ORIGIN environment variable is not defined in .env (e.g. CORS_ORIGIN=http://localhost:3000,http://localhost:5173)',
    );
  }
  const allowedOrigins = corsOrigin.split(',').map((origin) => origin.trim());

  // Security
  app.use(helmet());
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // Global Prefix
  app.setGlobalPrefix('api/v1');

  // Middleware
  app.use(cookieParser());

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Exception Filtering
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  // Graceful Shutdown
  app.enableShutdownHooks();

  const portStr = configService.get<string>('PORT');
  if (!portStr) {
    throw new Error('PORT environment variable is not defined in .env (e.g. PORT=3000)');
  }
  const port = parseInt(portStr, 10);
  if (isNaN(port)) {
    throw new Error(
      `PORT environment variable in .env must be a valid number, received: "${portStr}"`,
    );
  }

  await app.listen(port);
}
bootstrap().catch((err) => {
  console.error('Error starting server', err);
  process.exit(1);
});
