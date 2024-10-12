import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(reviewerId: number, createReviewDto: CreateReviewDto) {
    const project = await this.prisma.project.findUnique({
      where: { id: createReviewDto.projectId },
      include: { 
        client: true, 
        proposals: { 
          where: { status: 'accepted' }, 
          include: { freelancer: true } 
        } 
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const acceptedProposal = project.proposals[0];

    if (!acceptedProposal) {
      throw new ForbiddenException('This project has no accepted proposal. Please accept a proposal before reviewing.');
    }

    const isClientReviewing = project.client.id === reviewerId;
    const isFreelancerReviewing = acceptedProposal.freelancer.id === reviewerId;

    if (!isClientReviewing && !isFreelancerReviewing) {
      throw new ForbiddenException('You are not authorized to review this project');
    }

    if ((isClientReviewing && createReviewDto.revieweeId === project.client.id) ||
        (isFreelancerReviewing && createReviewDto.revieweeId === acceptedProposal.freelancer.id)) {
      throw new ForbiddenException('You cannot review yourself');
    }

    return this.prisma.review.create({
      data: {
        ...createReviewDto,
        reviewerId,
      },
    });
  }

  async findAll() {
    return this.prisma.review.findMany({
      include: {
        project: true,
        reviewer: { select: { id: true, username: true } },
        reviewee: { select: { id: true, username: true } },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.review.findUnique({
      where: { id },
      include: {
        project: true,
        reviewer: { select: { id: true, username: true } },
        reviewee: { select: { id: true, username: true } },
      },
    });
  }
}
