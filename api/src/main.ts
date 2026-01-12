import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as cors from 'cors';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    /**
     * ---------------------------
     * Security middleware
     * ---------------------------
     */
    app.use(helmet());

    /**
     * ---------------------------
     * CORS CONFIGURATION (CRITICAL)
     * ---------------------------
     * We explicitly require CORS_ORIGIN.
     * No localhost fallback.
     * No wildcard.
     * This is REQUIRED for browsers with credentials.
     */
    if (!process.env.CORS_ORIGIN) {
      throw new Error('CORS_ORIGIN environment variable is not defined');
    }

    app.use(
      cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
      }),
    );

    /**
     * ---------------------------
     * Global exception handling
     * ---------------------------
     */
    app.useGlobalFilters(new AllExceptionsFilter());

    /**
     * ---------------------------
     * Global validation
     * ---------------------------
     */
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    /**
     * ---------------------------
     * Server startup
     * ---------------------------
     * Render REQUIRES process.env.PORT
     */
    const port = process.env.PORT;
    if (!port) {
      throw new Error('PORT environment variable is not defined');
    }

    await app.listen(port, '0.0.0.0');

    console.log(`API server is running on port ${port}`);
  } catch (error) {
    console.error('❌ Failed to start API:', error);
    process.exit(1);
  }
}

bootstrap();