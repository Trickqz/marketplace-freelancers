import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProposalDto } from './dto/create-proposal.dto';

@Injectable()
export class ProposalsService {
  constructor(private prisma: PrismaService) {}

  async createProposal(freelancerId: number, projectId: number, createProposalDto: CreateProposalDto) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return this.prisma.proposal.create({
      data: {
        ...createProposalDto,
        freelancer: { connect: { id: freelancerId } },
        project: { connect: { id: projectId } },
      },
    });
  }

  async getProjectProposals(projectId: number) {
    return this.prisma.proposal.findMany({
      where: { projectId },
      include: { freelancer: { select: { id: true, username: true, email: true } } },
    });
  }

  async updateProposalStatus(proposalId: number, status: 'accepted' | 'rejected') {
    return this.prisma.proposal.update({
      where: { id: proposalId },
      data: { status },
    });
  }

  async acceptProposal(clientId: number, proposalId: number) {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id: proposalId },
      include: { project: true },
    });

    if (!proposal) {
      throw new NotFoundException('Proposal not found');
    }

    if (proposal.project.clientId !== clientId) {
      throw new ForbiddenException('You are not authorized to accept this proposal');
    }

    if (proposal.status !== 'pending') {
      throw new ForbiddenException('This proposal is not pending');
    }

    // Rejeitar todas as outras propostas para este projeto
    await this.prisma.proposal.updateMany({
      where: {
        projectId: proposal.projectId,
        id: { not: proposalId },
      },
      data: { status: 'rejected' },
    });

    // Aceitar a proposta selecionada
    return this.prisma.proposal.update({
      where: { id: proposalId },
      data: { status: 'accepted' },
    });
  }
}
