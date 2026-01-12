import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { Term } from '@prisma/client';

export interface CreateTermDto {
  programId: string;
  termNumber: number;
  title?: string;
}

export interface UpdateTermDto {
  termNumber?: number;
  title?: string;
}

@Injectable()
export class TermsService {
  constructor(private prisma: PrismaService) {}

  async findAll(programId?: string) {
    return this.prisma.term.findMany({
      where: programId ? { programId } : undefined,
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
    });
  }

  async findOne(id: string) {
    return this.prisma.term.findUnique({
      where: { id },
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
      }
    });
  }

  async create(data: CreateTermDto) {
    return this.prisma.term.create({
      data
    });
  }

  async update(id: string, data: UpdateTermDto) {
    return this.prisma.term.update({
      where: { id },
      data
    });
  }

  async delete(id: string) {
    return this.prisma.term.delete({
      where: { id }
    });
  }
}