import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { ProgramsService, CreateProgramDto, UpdateProgramDto } from './programs.service';

@Controller('programs')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ProgramsController {
  constructor(private programsService: ProgramsService) {}

  @Roles({ role: 'viewer', resource: 'program', action: 'read' })
  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('language') language?: string,
    @Query('topicId') topicId?: string
  ) {
    return this.programsService.findAll({ status, language, topicId });
  }

  @Roles({ role: 'viewer', resource: 'program', action: 'read' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.programsService.findOne(id);
  }

  @Roles({ role: 'editor', resource: 'program', action: 'create' })
  @Post()
  create(@Body() createProgramDto: CreateProgramDto) {
    return this.programsService.create(createProgramDto);
  }

  @Roles({ role: 'editor', resource: 'program', action: 'update' })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateProgramDto: UpdateProgramDto) {
    return this.programsService.update(id, updateProgramDto);
  }

  @Roles({ role: 'editor', resource: 'program', action: 'delete' })
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.programsService.delete(id);
  }

  @Roles({ role: 'editor', resource: 'program', action: 'publish' })
  @Post(':id/publish')
  publish(@Param('id') id: string) {
    return this.programsService.publish(id);
  }

  @Roles({ role: 'editor', resource: 'program', action: 'archive' })
  @Post(':id/archive')
  archive(@Param('id') id: string) {
    return this.programsService.archive(id);
  }
}