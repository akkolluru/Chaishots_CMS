import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { LessonsService, CreateLessonDto, UpdateLessonDto } from './lessons.service';

@Controller('lessons')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class LessonsController {
  constructor(private lessonsService: LessonsService) {}

  @Roles({ role: 'viewer', resource: 'lesson', action: 'read' })
  @Get()
  findAll(
    @Query('termId') termId?: string,
    @Query('status') status?: string
  ) {
    return this.lessonsService.findAll({ termId, status: status as any });
  }

  @Roles({ role: 'viewer', resource: 'lesson', action: 'read' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonsService.findOne(id);
  }

  @Roles({ role: 'editor', resource: 'lesson', action: 'create' })
  @Post()
  create(@Body() createLessonDto: CreateLessonDto) {
    return this.lessonsService.create(createLessonDto);
  }

  @Roles({ role: 'editor', resource: 'lesson', action: 'update' })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto) {
    return this.lessonsService.update(id, updateLessonDto);
  }

  @Roles({ role: 'editor', resource: 'lesson', action: 'delete' })
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.lessonsService.delete(id);
  }

  @Roles({ role: 'editor', resource: 'lesson', action: 'publish' })
  @Post(':id/publish-now')
  publishNow(@Param('id') id: string) {
    return this.lessonsService.publishNow(id);
  }

  @Roles({ role: 'editor', resource: 'lesson', action: 'publish' })
  @Post(':id/schedule')
  schedule(@Param('id') id: string, @Body('publishAt') publishAt: Date) {
    return this.lessonsService.schedule(id, publishAt);
  }

  @Roles({ role: 'editor', resource: 'lesson', action: 'archive' })
  @Post(':id/archive')
  archive(@Param('id') id: string) {
    return this.lessonsService.archive(id);
  }
}