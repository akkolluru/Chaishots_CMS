import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { Program, Lesson } from '@prisma/client';

export interface CursorPaginationParams {
  cursor?: string;
  limit?: number;
}

@Injectable()
export class CatalogService {
  constructor(private prisma: PrismaService) {}

  async findPublishedPrograms(
    filters?: { 
      language?: string; 
      topicId?: string; 
    },
    pagination?: CursorPaginationParams
  ) {
    const whereClause: any = {
      status: 'published',
      publishedAt: { not: null }, // Ensure publishedAt is set
    };
    
    if (filters?.language) {
      whereClause.languagePrimary = filters.language;
    }
    
    if (filters?.topicId) {
      whereClause.topics = {
        some: {
          topicId: filters.topicId
        }
      };
    }

    // Only include programs that have at least one published lesson
    whereClause.terms = {
      some: {
        lessons: {
          some: {
            status: 'published',
            publishedAt: { not: null }
          }
        }
      }
    };

    const limit = Math.min(pagination?.limit || 10, 50); // Max 50 per page
    const cursor = pagination?.cursor;

    const programs = await this.prisma.program.findMany({
      where: whereClause,
      include: {
        topics: {
          include: {
            topic: true
          }
        },
        terms: {
          include: {
            lessons: {
              where: {
                status: 'published',
                publishedAt: { not: null }
              },
              select: {
                id: true,
                termId: true,
                lessonNumber: true,
                title: true,
                contentType: true,
                durationMs: true,
                isPaid: true,
                contentLanguagePrimary: true,
                contentLanguagesAvailable: true,
                contentUrlsByLanguage: true,
                subtitleLanguages: true,
                subtitleUrlsByLanguage: true,
                status: true,
                publishedAt: true,
                createdAt: true,
                updatedAt: true,
                assets: true
              },
              orderBy: {
                lessonNumber: 'asc'
              }
            }
          },
          orderBy: {
            termNumber: 'asc'
          }
        },
        assets: true
      },
      take: limit + 1, // Get one extra to check if there's a next page
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1
      }),
      orderBy: {
        publishedAt: 'desc' // Sort by most recently published
      }
    });

    let hasNextPage = false;
    if (programs.length > limit) {
      programs.pop(); // Remove the extra item
      hasNextPage = true;
    }

    return {
      data: programs,
      hasNextPage,
      nextCursor: hasNextPage && programs.length > 0 ? programs[programs.length - 1].id : null
    };
  }

  async findPublishedProgramById(id: string) {
    return this.prisma.program.findFirst({
      where: {
        id,
        status: 'published',
        publishedAt: { not: null },
        terms: {
          some: {
            lessons: {
              some: {
                status: 'published',
                publishedAt: { not: null }
              }
            }
          }
        }
      },
      include: {
        topics: {
          include: {
            topic: true
          }
        },
        terms: {
          include: {
            lessons: {
              where: {
                status: 'published',
                publishedAt: { not: null }
              },
              select: {
                id: true,
                termId: true,
                lessonNumber: true,
                title: true,
                contentType: true,
                durationMs: true,
                isPaid: true,
                contentLanguagePrimary: true,
                contentLanguagesAvailable: true,
                contentUrlsByLanguage: true,
                subtitleLanguages: true,
                subtitleUrlsByLanguage: true,
                status: true,
                publishedAt: true,
                createdAt: true,
                updatedAt: true,
                assets: true
              },
              orderBy: {
                lessonNumber: 'asc'
              }
            }
          },
          orderBy: {
            termNumber: 'asc'
          }
        },
        assets: true
      }
    });
  }

  async findPublishedLessonById(id: string) {
    return this.prisma.lesson.findFirst({
      where: {
        id,
        status: 'published',
        publishedAt: { not: null }
      },
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
}