import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));

  const configService = app.get(ConfigService);
  const corsOrigin = configService.get<string>('CORS_ORIGIN');
  const allowedOrigins = corsOrigin!.split(',').map((origin) => origin.trim());

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

  // Exception Filtering — Logger fetched from DI container since this filter is
  // registered outside of NestJS module scope (cannot use standard DI here).
  const httpAdapterHost = app.get(HttpAdapterHost);
  const logger = app.get(Logger);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost, logger));

  // OpenAPI Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Project X API')
    .setDescription('Production-grade REST API for Project X SaaS platform')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/v1/docs', app, document);

  // Graceful Shutdown
  app.enableShutdownHooks();

  const port = configService.get<number>('PORT');
  await app.listen(port!);
}

bootstrap().catch((err) => {
  console.error('Error starting server', err);
  process.exit(1);
});
