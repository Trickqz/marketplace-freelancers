import { Controller, Get, Post, Body, UseGuards, Request, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectFilterDto } from './dto/project-filter.dto';

@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Post()
  @Roles('client')
  async createProject(@Request() req, @Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.createProject(req.user.userId, createProjectDto);
  }

  @Get()
  @Roles('freelancer', 'client')
  async getProjects(@Request() req, @Query() filterDto: ProjectFilterDto) {
    if (req.user.role === 'client') {
      return this.projectsService.getClientProjects(req.user.userId);
    }
    return this.projectsService.getProjects(filterDto);
  }
}
