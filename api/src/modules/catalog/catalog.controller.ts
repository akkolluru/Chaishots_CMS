import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { CatalogService, CursorPaginationParams } from './catalog.service';

@Controller('catalog')
export class CatalogController {
  constructor(private catalogService: CatalogService) {}

  @Get('programs')
  findPublishedPrograms(
    @Res() res: Response,
    @Query('language') language?: string,
    @Query('topicId') topicId?: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string
  ) {
    // Set cache headers
    res.set({
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', // 5 min cache, 10 min stale
      'Vary': 'Accept-Encoding'
    });

    const result = this.catalogService.findPublishedPrograms(
      { language, topicId },
      {
        cursor,
        limit: limit ? parseInt(limit) : undefined
      }
    );

    res.json(result);
  }

  @Get('programs/:id')
  findPublishedProgramById(@Res() res: Response, @Param('id') id: string) {
    // Set cache headers
    res.set({
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', // 5 min cache, 10 min stale
      'Vary': 'Accept-Encoding'
    });

    const result = this.catalogService.findPublishedProgramById(id);
    res.json(result);
  }

  @Get('lessons/:id')
  findPublishedLessonById(@Res() res: Response, @Param('id') id: string) {
    // Set cache headers
    res.set({
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', // 5 min cache, 10 min stale
      'Vary': 'Accept-Encoding'
    });

    const result = this.catalogService.findPublishedLessonById(id);
    res.json(result);
  }
}