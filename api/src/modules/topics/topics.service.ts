import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { Topic } from '@prisma/client';

export interface CreateTopicDto {
  name: string;
}

export interface UpdateTopicDto {
  name?: string;
}

@Injectable()
export class TopicsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.topic.findMany({
      include: {
        programs: {
          include: {
            program: true
          }
        }
      }
    });
  }

  async findOne(id: string) {
    return this.prisma.topic.findUnique({
      where: { id },
      include: {
        programs: {
          include: {
            program: true
          }
        }
      }
    });
  }

  async findByName(name: string) {
    return this.prisma.topic.findUnique({
      where: { name }
    });
  }

  async create(data: CreateTopicDto) {
    // Check if topic with this name already exists
    const existingTopic = await this.prisma.topic.findUnique({
      where: { name: data.name }
    });

    if (existingTopic) {
      throw new Error('Topic with this name already exists');
    }

    return this.prisma.topic.create({
      data
    });
  }

  async update(id: string, data: UpdateTopicDto) {
    // Check if topic with new name already exists (if name is being updated)
    if (data.name) {
      const existingTopic = await this.prisma.topic.findUnique({
        where: { name: data.name }
      });

      if (existingTopic && existingTopic.id !== id) {
        throw new Error('Topic with this name already exists');
      }
    }

    return this.prisma.topic.update({
      where: { id },
      data
    });
  }

  async delete(id: string) {
    return this.prisma.topic.delete({
      where: { id }
    });
  }
}