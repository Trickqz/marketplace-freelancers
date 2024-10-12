import { Controller, Post, Get, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ProposalsService } from './proposals.service';
import { CreateProposalDto } from './dto/create-proposal.dto';

@Controller('proposals')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProposalsController {
  constructor(private proposalsService: ProposalsService) {}

  @Post(':projectId')
  @Roles('freelancer')
  async createProposal(@Request() req, @Param('projectId') projectId: string, @Body() createProposalDto: CreateProposalDto) {
    return this.proposalsService.createProposal(req.user.userId, +projectId, createProposalDto);
  }

  @Get('project/:projectId')
  @Roles('client')
  async getProjectProposals(@Param('projectId') projectId: string) {
    return this.proposalsService.getProjectProposals(+projectId);
  }

  @Put(':proposalId/status')
  @Roles('client')
  async updateProposalStatus(@Param('proposalId') proposalId: string, @Body('status') status: 'accepted' | 'rejected') {
    return this.proposalsService.updateProposalStatus(+proposalId, status);
  }

  @Put(':proposalId/accept')
  @Roles('client')
  async acceptProposal(@Request() req, @Param('proposalId') proposalId: string) {
    return this.proposalsService.acceptProposal(req.user.userId, +proposalId);
  }
}
