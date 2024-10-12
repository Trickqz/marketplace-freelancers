import { Module } from '@nestjs/common';
import { FreelancersController } from './freelancers.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [PrismaModule, ProjectsModule],
  controllers: [FreelancersController],
})
export class FreelancersModule {}
