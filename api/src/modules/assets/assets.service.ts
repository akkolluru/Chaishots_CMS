import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { ProgramAsset, LessonAsset, AssetType, AssetVariant } from '@prisma/client';

export interface CreateProgramAssetDto {
  programId: string;
  language: string;
  variant: AssetVariant;
  assetType: AssetType;
  url: string;
}

export interface CreateLessonAssetDto {
  lessonId: string;
  language: string;
  variant: AssetVariant;
  assetType: AssetType;
  url: string;
}

@Injectable()
export class AssetsService {
  constructor(private prisma: PrismaService) {}

  // Program Assets
  async findProgramAssets(programId: string) {
    return this.prisma.programAsset.findMany({
      where: { programId }
    });
  }

  async findProgramAsset(programId: string, language: string, variant: AssetVariant, assetType: AssetType) {
    return this.prisma.programAsset.findUnique({
      where: {
        programId_language_variant_assetType: {
          programId,
          language,
          variant,
          assetType
        }
      }
    });
  }

  async createProgramAsset(data: CreateProgramAssetDto) {
    return this.prisma.programAsset.create({
      data
    });
  }

  async updateProgramAsset(programId: string, language: string, variant: AssetVariant, assetType: AssetType, url: string) {
    return this.prisma.programAsset.update({
      where: {
        programId_language_variant_assetType: {
          programId,
          language,
          variant,
          assetType
        }
      },
      data: { url }
    });
  }

  async deleteProgramAsset(programId: string, language: string, variant: AssetVariant, assetType: AssetType) {
    return this.prisma.programAsset.delete({
      where: {
        programId_language_variant_assetType: {
          programId,
          language,
          variant,
          assetType
        }
      }
    });
  }

  // Lesson Assets
  async findLessonAssets(lessonId: string) {
    return this.prisma.lessonAsset.findMany({
      where: { lessonId }
    });
  }

  async findLessonAsset(lessonId: string, language: string, variant: AssetVariant, assetType: AssetType) {
    return this.prisma.lessonAsset.findUnique({
      where: {
        lessonId_language_variant_assetType: {
          lessonId,
          language,
          variant,
          assetType
        }
      }
    });
  }

  async createLessonAsset(data: CreateLessonAssetDto) {
    return this.prisma.lessonAsset.create({
      data
    });
  }

  async updateLessonAsset(lessonId: string, language: string, variant: AssetVariant, assetType: AssetType, url: string) {
    return this.prisma.lessonAsset.update({
      where: {
        lessonId_language_variant_assetType: {
          lessonId,
          language,
          variant,
          assetType
        }
      },
      data: { url }
    });
  }

  async deleteLessonAsset(lessonId: string, language: string, variant: AssetVariant, assetType: AssetType) {
    return this.prisma.lessonAsset.delete({
      where: {
        lessonId_language_variant_assetType: {
          lessonId,
          language,
          variant,
          assetType
        }
      }
    });
  }
}