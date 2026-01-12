import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * 1️⃣ CORS MUST COME FIRST
   */
  app.enableCors({
    origin: 'https://chaishots-cms-frontend.onrender.com',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  /**
   * 2️⃣ THEN security headers
   */
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
      crossOriginOpenerPolicy: false,
    }),
  );

  /**
   * 3️⃣ Validation
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  /**
   * 4️⃣ Start server (Render uses PORT=10000)
   */
  const port = process.env.PORT || 10000;
  await app.listen(port, '0.0.0.0');

  console.log(`API running on port ${port}`);
}

bootstrap();