import { Module } from '@nestjs/common';
import { PublishingWorkerService } from './publishing-worker.service';
import { LessonsModule } from '../modules/lessons/lessons.module';
import { PrismaModule } from '../modules/prisma/prisma.module';

@Module({
  imports: [LessonsModule, PrismaModule],
  providers: [PublishingWorkerService],
  exports: [PublishingWorkerService],
})
export class PublishingWorkerModule {}