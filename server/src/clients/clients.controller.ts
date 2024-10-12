import { Controller, Get, Post, Put, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from '../users/dto/update-profile.dto';
import { ProjectsService } from '../projects/projects.service';
import { CreateProjectDto } from '../projects/dto/create-project.dto';

@Controller('clients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClientsController {
  constructor(
    private prisma: PrismaService,
    private projectsService: ProjectsService
  ) {}

  @Get('profile')
  @Roles('client')
  async getProfile(@Request() req) {
    return this.prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, username: true, email: true, fullName: true, bio: true, companyName: true, role: true },
    });
  }

  @Put('profile')
  @Roles('client')
  async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: req.user.userId },
      data: updateProfileDto,
      select: { id: true, username: true, email: true, fullName: true, bio: true, companyName: true, role: true },
    });
  }

  @Post('projects')
  @Roles('client')
  async createProject(@Request() req, @Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.createProject(req.user.userId, createProjectDto);
  }

  @Get('projects')
  @Roles('client')
  async getMyProjects(@Request() req) {
    return this.projectsService.getClientProjects(req.user.userId);
  }
}
