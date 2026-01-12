import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LessonsService } from '../modules/lessons/lessons.service';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class PublishingWorkerService {
  private readonly logger = new Logger(PublishingWorkerService.name);

  constructor(
    private lessonsService: LessonsService,
    private prisma: PrismaService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE) // Run every minute
  async handleCron() {
    this.logger.log('Running scheduled publishing check...');

    try {
      // Find lessons that are scheduled and ready to be published
      const scheduledLessons = await this.lessonsService.findScheduledLessonsReadyForPublishing();

      if (scheduledLessons.length === 0) {
        this.logger.log('No scheduled lessons to publish');
        return;
      }

      this.logger.log(`Found ${scheduledLessons.length} lessons ready for publishing`);

      // Process each lesson that's ready to be published
      for (const lesson of scheduledLessons) {
        try {
          // Publish the lesson in a transaction to ensure consistency
          await this.lessonsService.publishLessonInTransaction(lesson.id);
          this.logger.log(`Successfully published lesson ${lesson.id}`);
        } catch (error) {
          // Log the full error with stack trace for debugging
          this.logger.error(`Failed to publish lesson ${lesson.id}:`, error);

          // Instead of just continuing, we could implement retry logic or dead letter queue
          // For now, we continue with other lessons to prevent blocking
        }
      }

      this.logger.log('Scheduled publishing check completed');
    } catch (error) {
      // Log the full error with stack trace
      this.logger.error(`Critical error during scheduled publishing check:`, error);

      // In a production system, we might want to alert administrators
      // or implement circuit breaker patterns to prevent repeated failures
    }
  }
}