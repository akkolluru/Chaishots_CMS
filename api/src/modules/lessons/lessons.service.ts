import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { Lesson, Status } from '@prisma/client';

export interface CreateLessonDto {
  termId: string;
  lessonNumber: number;
  title: string;
  contentType: 'video' | 'article';
  durationMs?: number; // required if video
  isPaid?: boolean;
  
  // Multi-language content
  contentLanguagePrimary: string;
  contentLanguagesAvailable: string[];
  contentUrlsByLanguage: any; // map of language -> URL
  subtitleLanguages?: string[];
  subtitleUrlsByLanguage?: any; // map of language -> URL (optional)
}

export interface UpdateLessonDto {
  title?: string;
  contentType?: 'video' | 'article';
  durationMs?: number;
  isPaid?: boolean;

  // Multi-language content
  contentLanguagePrimary?: string;
  contentLanguagesAvailable?: string[];
  contentUrlsByLanguage?: any; // map of language -> URL
  subtitleLanguages?: string[];
  subtitleUrlsByLanguage?: any; // map of language -> URL (optional)

  // Publishing workflow
  status?: Status;
  publishAt?: Date;
  publishedAt?: Date;
}

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: { termId?: string; status?: Status }) {
    const whereClause: any = {};
    
    if (filters?.termId) {
      whereClause.termId = filters.termId;
    }
    
    if (filters?.status) {
      whereClause.status = filters.status;
    }

    return this.prisma.lesson.findMany({
      where: whereClause,
      include: {
        term: {
          include: {
            program: true
          }
        },
        assets: true
      },
      orderBy: {
        lessonNumber: 'asc'
      }
    });
  }

  async findOne(id: string) {
    return this.prisma.lesson.findUnique({
      where: { id },
      include: {
        term: {
          include: {
            program: true
          }
        },
        assets: true
      }
    });
  }

  async create(data: CreateLessonDto) {
    // Validate that if content type is video, duration is provided
    if (data.contentType === 'video' && (!data.durationMs || data.durationMs <= 0)) {
      throw new Error('Duration is required for video content');
    }

    // Validate that primary language is included in available languages
    if (!data.contentLanguagesAvailable.includes(data.contentLanguagePrimary)) {
      throw new Error('Primary language must be included in available languages');
    }

    // Validate that if subtitle languages are provided, they match subtitle URLs
    if (data.subtitleLanguages && data.subtitleUrlsByLanguage) {
      const subtitleLangs = Object.keys(data.subtitleUrlsByLanguage);
      const missingSubtitleLangs = data.subtitleLanguages.filter(lang => !subtitleLangs.includes(lang));
      if (missingSubtitleLangs.length > 0) {
        throw new Error(`Missing subtitle URLs for languages: ${missingSubtitleLangs.join(', ')}`);
      }
    }

    return this.prisma.lesson.create({
      data
    });
  }

  async update(id: string, data: UpdateLessonDto) {
    // If status is changing to scheduled, ensure publishAt is set
    if (data.status === 'scheduled' && !data.publishAt) {
      throw new Error('Publish date is required when scheduling a lesson');
    }

    // If status is changing to published and publishedAt is not set, set it to now
    if (data.status === 'published' && !data.publishedAt) {
      const lesson = await this.prisma.lesson.findUnique({
        where: { id }
      });

      if (lesson && !lesson.publishedAt) {
        data.publishedAt = new Date();
      }
    }

    // If content language primary is being updated, validate that it's in available languages
    if (data.contentLanguagePrimary && data.contentLanguagesAvailable) {
      if (!data.contentLanguagesAvailable.includes(data.contentLanguagePrimary)) {
        throw new Error('Primary language must be included in available languages');
      }
    }

    // Validate that if subtitle languages are provided, they match subtitle URLs
    if (data.subtitleLanguages && data.subtitleUrlsByLanguage) {
      const subtitleLangs = Object.keys(data.subtitleUrlsByLanguage);
      const missingSubtitleLangs = data.subtitleLanguages.filter(lang => !subtitleLangs.includes(lang));
      if (missingSubtitleLangs.length > 0) {
        throw new Error(`Missing subtitle URLs for languages: ${missingSubtitleLangs.join(', ')}`);
      }
    }

    return this.prisma.lesson.update({
      where: { id },
      data
    });
  }

  async delete(id: string) {
    return this.prisma.lesson.delete({
      where: { id }
    });
  }

  async publishNow(id: string) {
    return this.prisma.lesson.update({
      where: { id },
      data: {
        status: 'published',
        publishedAt: new Date()
      }
    });
  }

  async schedule(id: string, publishAt: Date) {
    return this.prisma.lesson.update({
      where: { id },
      data: {
        status: 'scheduled',
        publishAt
      }
    });
  }

  async archive(id: string) {
    return this.prisma.lesson.update({
      where: { id },
      data: {
        status: 'archived'
      }
    });
  }

  // Method to find lessons that are scheduled and ready to be published
  async findScheduledLessonsReadyForPublishing() {
    return this.prisma.lesson.findMany({
      where: {
        status: 'scheduled',
        publishAt: {
          lte: new Date() // Less than or equal to now
        }
      },
      include: {
        term: {
          include: {
            program: true
          }
        }
      }
    });
  }

  // Method to publish a lesson in a transaction
  async publishLessonInTransaction(lessonId: string) {
    return this.prisma.$transaction(async (tx) => {
      // First, check if the lesson exists and is still scheduled
      const lesson = await tx.lesson.findUnique({
        where: { id: lessonId },
        include: {
          term: {
            include: {
              program: true
            }
          }
        }
      });

      if (!lesson) {
        throw new Error('Lesson was not found');
      }

      if (lesson.status !== 'scheduled') {
        // If lesson is already published or archived, return it as is
        return lesson;
      }

      // Update the lesson status and publishedAt
      const updatedLesson = await tx.lesson.update({
        where: {
          id: lessonId,
          status: 'scheduled' // Ensure it's still scheduled to prevent double-publishing
        },
        data: {
          status: 'published',
          publishedAt: new Date()
        },
        include: {
          term: {
            include: {
              program: true
            }
          }
        }
      });

      // Update the program status to published if it's not already published
      // and it has at least one published lesson
      await tx.program.updateMany({
        where: {
          id: updatedLesson.term.programId,
          status: { not: 'published' } // Only update if not already published
        },
        data: {
          status: 'published',
          publishedAt: new Date() // Set publishedAt to current date
        }
      });

      return updatedLesson;
    });
  }
}