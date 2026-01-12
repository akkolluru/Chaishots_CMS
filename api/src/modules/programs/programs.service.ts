import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { Program } from '@prisma/client';

export interface CreateProgramDto {
  title: string;
  description?: string;
  languagePrimary: string;
  languagesAvailable: string[];
  topicIds?: string[];
}

export interface UpdateProgramDto {
  title?: string;
  description?: string;
  languagePrimary?: string;
  languagesAvailable?: string[];
  topicIds?: string[];
}

@Injectable()
export class ProgramsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: { status?: string; language?: string; topicId?: string }) {
    const whereClause: any = {};

    if (filters?.status) {
      whereClause.status = filters.status;
    }

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

    return this.prisma.program.findMany({
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
              select: {
                id: true,
                title: true,
                lessonNumber: true,
                status: true,
                publishAt: true,
                publishedAt: true,
                isPaid: true,
                createdAt: true,
                updatedAt: true,
              }
            }
          }
        },
        assets: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findOne(id: string) {
    return this.prisma.program.findUnique({
      where: { id },
      include: {
        topics: {
          include: {
            topic: true
          }
        },
        terms: {
          include: {
            lessons: {
              select: {
                id: true,
                title: true,
                lessonNumber: true,
                status: true,
                publishAt: true,
                publishedAt: true,
                isPaid: true,
                createdAt: true,
                updatedAt: true,
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

  async create(data: CreateProgramDto) {
    const { topicIds, ...programData } = data;

    // Validate that primary language is included in available languages
    if (!programData.languagesAvailable.includes(programData.languagePrimary)) {
      throw new Error('Primary language must be included in available languages');
    }

    const program = await this.prisma.program.create({
      data: {
        ...programData,
        topics: topicIds && topicIds.length > 0 ? {
          create: topicIds.map(topicId => ({
            topic: {
              connect: { id: topicId }
            }
          }))
        } : undefined
      },
      include: {
        topics: {
          include: {
            topic: true
          }
        },
        assets: true
      }
    });

    return program;
  }

  async update(id: string, data: UpdateProgramDto) {
    const { topicIds, ...programData } = data;

    // If languagePrimary is being updated, validate that it's in languagesAvailable
    if (programData.languagePrimary && programData.languagesAvailable) {
      if (!programData.languagesAvailable.includes(programData.languagePrimary)) {
        throw new Error('Primary language must be included in available languages');
      }
    }

    // If topicIds are provided, we need to update the relationships
    if (topicIds !== undefined) {
      // First, delete existing relationships
      await this.prisma.programToTopic.deleteMany({
        where: { programId: id }
      });

      // Then create new relationships
      if (topicIds.length > 0) {
        await this.prisma.programToTopic.createMany({
          data: topicIds.map(topicId => ({
            programId: id,
            topicId: topicId
          }))
        });
      }
    }

    return this.prisma.program.update({
      where: { id },
      data: programData,
      include: {
        topics: {
          include: {
            topic: true
          }
        },
        assets: true
      }
    });
  }

  async delete(id: string) {
    return this.prisma.program.delete({
      where: { id }
    });
  }

  async publish(id: string) {
    return this.prisma.program.update({
      where: { id },
      data: {
        status: 'published',
        publishedAt: new Date()
      }
    });
  }

  async archive(id: string) {
    return this.prisma.program.update({
      where: { id },
      data: {
        status: 'archived'
      }
    });
  }
}