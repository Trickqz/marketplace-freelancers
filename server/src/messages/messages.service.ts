import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async create(senderId: number, createMessageDto: CreateMessageDto) {
    const project = await this.prisma.project.findUnique({
      where: { id: createMessageDto.projectId },
      include: { client: true, proposals: { where: { status: 'accepted' }, include: { freelancer: true } } },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const acceptedProposal = project.proposals[0];

    if (!acceptedProposal) {
      throw new ForbiddenException('This project has no accepted proposal');
    }

    const isClientSending = project.client.id === senderId;
    const isFreelancerSending = acceptedProposal.freelancer.id === senderId;

    if (!isClientSending && !isFreelancerSending) {
      throw new ForbiddenException('You are not authorized to send messages for this project');
    }

    if ((isClientSending && createMessageDto.receiverId !== acceptedProposal.freelancer.id) ||
        (isFreelancerSending && createMessageDto.receiverId !== project.client.id)) {
      throw new ForbiddenException('Invalid receiver for this project');
    }

    return this.prisma.message.create({
      data: {
        content: createMessageDto.content,
        sender: { connect: { id: senderId } },
        receiver: { connect: { id: createMessageDto.receiverId } },
        project: { connect: { id: createMessageDto.projectId } },
      },
    });
  }

  async getProjectMessages(userId: number, projectId: number) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: { client: true, proposals: { where: { status: 'accepted' }, include: { freelancer: true } } },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const acceptedProposal = project.proposals[0];

    if (!acceptedProposal) {
      throw new ForbiddenException('This project has no accepted proposal');
    }

    if (userId !== project.client.id && userId !== acceptedProposal.freelancer.id) {
      throw new ForbiddenException('You are not authorized to view messages for this project');
    }

    return this.prisma.message.findMany({
      where: { projectId },
      orderBy: { createdAt: 'asc' },
      include: { sender: { select: { id: true, username: true } } },
    });
  }
}

