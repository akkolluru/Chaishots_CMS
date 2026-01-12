import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { INestApplication } from '@nestjs/common';
import { PublishingWorkerService } from './publishing-worker.service';

async function bootstrap() {
  try {
    const app: INestApplication = await NestFactory.create(AppModule);

    // Initialize the application
    await app.init();

    // Get the worker service
    const workerService = app.get(PublishingWorkerService);

    // Since the worker service has a cron job, we just need to keep the process alive
    console.log('Worker started successfully');

    // Keep the process alive for the cron job to run
    // The cron job will run automatically due to the @Cron decorator
  } catch (error) {
    console.error('Error starting worker:', error);
    process.exit(1);
  }
}
bootstrap();

// Keep the process alive
process.stdin.resume();