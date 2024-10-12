import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectFilterDto } from './dto/project-filter.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async createProject(clientId: number, createProjectDto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        ...createProjectDto,
        clientId,
        categoryId: createProjectDto.categoryId,
      },
    });
  }

  async getProjects(filterDto: ProjectFilterDto) {
    const { search, categoryId, minBudget, maxBudget, deadlineAfter, deadlineBefore } = filterDto;

    const where: any = { status: 'open' };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (minBudget || maxBudget) {
      where.budget = {};
      if (minBudget) where.budget.gte = minBudget;
      if (maxBudget) where.budget.lte = maxBudget;
    }

    if (deadlineAfter || deadlineBefore) {
      where.deadline = {};
      if (deadlineAfter) where.deadline.gte = new Date(deadlineAfter);
      if (deadlineBefore) where.deadline.lte = new Date(deadlineBefore);
    }

    return this.prisma.project.findMany({
      where,
      include: { 
        client: { select: { username: true, email: true } },
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getClientProjects(clientId: number) {
    return this.prisma.project.findMany({
      where: { clientId },
      include: { client: { select: { username: true, email: true } } },
    });
  }
}
