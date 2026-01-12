import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { RolesGuard } from './guards/roles.guard';
import { HomeController } from './controllers/home.controller';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProgramsModule } from './modules/programs/programs.module';
import { TermsModule } from './modules/terms/terms.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { TopicsModule } from './modules/topics/topics.module';
import { AssetsModule } from './modules/assets/assets.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { HealthModule } from './modules/health/health.module';
import { PublishingWorkerModule } from './workers/publishing-worker.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProgramsModule,
    TermsModule,
    LessonsModule,
    TopicsModule,
    AssetsModule,
    CatalogModule,
    HealthModule,
    PublishingWorkerModule,
  ],
  controllers: [HomeController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}