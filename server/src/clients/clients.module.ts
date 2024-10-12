import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [PrismaModule, ProjectsModule],
  controllers: [ClientsController],
})
export class ClientsModule {}
