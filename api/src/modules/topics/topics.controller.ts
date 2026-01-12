import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { TopicsService, CreateTopicDto, UpdateTopicDto } from './topics.service';

@Controller('topics')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class TopicsController {
  constructor(private topicsService: TopicsService) {}

  @Roles({ role: 'viewer', resource: 'topic', action: 'read' })
  @Get()
  findAll() {
    return this.topicsService.findAll();
  }

  @Roles({ role: 'viewer', resource: 'topic', action: 'read' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.topicsService.findOne(id);
  }

  @Roles({ role: 'editor', resource: 'topic', action: 'create' })
  @Post()
  create(@Body() createTopicDto: CreateTopicDto) {
    return this.topicsService.create(createTopicDto);
  }

  @Roles({ role: 'editor', resource: 'topic', action: 'update' })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateTopicDto: UpdateTopicDto) {
    return this.topicsService.update(id, updateTopicDto);
  }

  @Roles({ role: 'editor', resource: 'topic', action: 'delete' })
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.topicsService.delete(id);
  }
}