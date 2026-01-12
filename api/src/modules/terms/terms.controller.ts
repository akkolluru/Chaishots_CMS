import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { TermsService, CreateTermDto, UpdateTermDto } from './terms.service';

@Controller('terms')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class TermsController {
  constructor(private termsService: TermsService) {}

  @Roles({ role: 'viewer', resource: 'term', action: 'read' })
  @Get()
  findAll(@Query('programId') programId?: string) {
    return this.termsService.findAll(programId);
  }

  @Roles({ role: 'viewer', resource: 'term', action: 'read' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.termsService.findOne(id);
  }

  @Roles({ role: 'editor', resource: 'term', action: 'create' })
  @Post()
  create(@Body() createTermDto: CreateTermDto) {
    return this.termsService.create(createTermDto);
  }

  @Roles({ role: 'editor', resource: 'term', action: 'update' })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateTermDto: UpdateTermDto) {
    return this.termsService.update(id, updateTermDto);
  }

  @Roles({ role: 'editor', resource: 'term', action: 'delete' })
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.termsService.delete(id);
  }
}