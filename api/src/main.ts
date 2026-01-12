import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * 🔑 CRITICAL: Enable CORS FIRST
   */
  app.enableCors({
    origin: 'https://chaishots-cms-frontend.onrender.com',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  /**
   * 🔑 CRITICAL: Explicitly handle OPTIONS globally
   */
  app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
    } else {
      next();
    }
  });

  /**
   * Security
   */
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
      crossOriginOpenerPolicy: false,
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 10000;
  await app.listen(port, '0.0.0.0');

  console.log(`API running on port ${port}`);
}

bootstrap();