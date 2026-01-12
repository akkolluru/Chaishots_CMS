import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { AssetsService, CreateProgramAssetDto, CreateLessonAssetDto } from './assets.service';

@Controller('assets')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AssetsController {
  constructor(private assetsService: AssetsService) {}

  // Program Assets
  @Roles({ role: 'viewer', resource: 'asset', action: 'read' })
  @Get('programs/:programId')
  findProgramAssets(@Param('programId') programId: string) {
    return this.assetsService.findProgramAssets(programId);
  }

  @Roles({ role: 'editor', resource: 'asset', action: 'create' })
  @Post('programs')
  createProgramAsset(@Body() createProgramAssetDto: CreateProgramAssetDto) {
    return this.assetsService.createProgramAsset(createProgramAssetDto);
  }

  @Roles({ role: 'editor', resource: 'asset', action: 'update' })
  @Put('programs/:programId/:language/:variant/:assetType')
  updateProgramAsset(
    @Param('programId') programId: string,
    @Param('language') language: string,
    @Param('variant') variant: string,
    @Param('assetType') assetType: string,
    @Body('url') url: string
  ) {
    return this.assetsService.updateProgramAsset(
      programId,
      language,
      variant as any,
      assetType as any,
      url
    );
  }

  @Roles({ role: 'editor', resource: 'asset', action: 'delete' })
  @Delete('programs/:programId/:language/:variant/:assetType')
  deleteProgramAsset(
    @Param('programId') programId: string,
    @Param('language') language: string,
    @Param('variant') variant: string,
    @Param('assetType') assetType: string
  ) {
    return this.assetsService.deleteProgramAsset(
      programId,
      language,
      variant as any,
      assetType as any
    );
  }

  // Lesson Assets
  @Roles({ role: 'viewer', resource: 'asset', action: 'read' })
  @Get('lessons/:lessonId')
  findLessonAssets(@Param('lessonId') lessonId: string) {
    return this.assetsService.findLessonAssets(lessonId);
  }

  @Roles({ role: 'editor', resource: 'asset', action: 'create' })
  @Post('lessons')
  createLessonAsset(@Body() createLessonAssetDto: CreateLessonAssetDto) {
    return this.assetsService.createLessonAsset(createLessonAssetDto);
  }

  @Roles({ role: 'editor', resource: 'asset', action: 'update' })
  @Put('lessons/:lessonId/:language/:variant/:assetType')
  updateLessonAsset(
    @Param('lessonId') lessonId: string,
    @Param('language') language: string,
    @Param('variant') variant: string,
    @Param('assetType') assetType: string,
    @Body('url') url: string
  ) {
    return this.assetsService.updateLessonAsset(
      lessonId,
      language,
      variant as any,
      assetType as any,
      url
    );
  }

  @Roles({ role: 'editor', resource: 'asset', action: 'delete' })
  @Delete('lessons/:lessonId/:language/:variant/:assetType')
  deleteLessonAsset(
    @Param('lessonId') lessonId: string,
    @Param('language') language: string,
    @Param('variant') variant: string,
    @Param('assetType') assetType: string
  ) {
    return this.assetsService.deleteLessonAsset(
      lessonId,
      language,
      variant as any,
      assetType as any
    );
  }
}