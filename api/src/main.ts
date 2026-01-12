import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
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
     * CORS CONFIGURATION (FIXED)
     * ---------------------------
     * Must use NestJS enableCors
     * NOT express cors() middleware
     */
    
    const corsOrigin = process.env.CORS_ORIGIN;
    app.use((req, res, next) => {
      console.log('➡️ Incoming request:', req.method, req.url);
      next();
    });

    if (!corsOrigin) {
      throw new Error('CORS_ORIGIN environment variable is not defined');
    }

    app.enableCors({
      origin: corsOrigin,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    });

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
     * Server startup (Render)
     * ---------------------------
     */
    const port = process.env.PORT;
    if (!port) {
      throw new Error('PORT environment variable is not defined');
    }

    await app.listen(port, '0.0.0.0');
    console.log(`✅ API server running on port ${port}`);
  } catch (error) {
    console.error(' Failed to start API:', error);
    process.exit(1);
  }
}

bootstrap();

