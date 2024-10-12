import { Controller, Get, Put, Body, UseGuards, Request, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from '../users/dto/update-profile.dto';
import { ProjectsService } from '../projects/projects.service';
import { ProjectFilterDto } from '../projects/dto/project-filter.dto';

@Controller('freelancers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FreelancersController {
  constructor(
    private prisma: PrismaService,
    private projectsService: ProjectsService
  ) {}

  @Get('profile')
  @Roles('freelancer')
  async getProfile(@Request() req) {
    return this.prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, username: true, email: true, fullName: true, bio: true, skills: true, role: true },
    });
  }

  @Put('profile')
  @Roles('freelancer')
  async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: req.user.userId },
      data: updateProfileDto,
      select: { id: true, username: true, email: true, fullName: true, bio: true, skills: true, role: true },
    });
  }

  @Get('projects')
  @Roles('freelancer')
  async getProjects(@Query() filterDto: ProjectFilterDto) {
    return this.projectsService.getProjects(filterDto);
  }
}
