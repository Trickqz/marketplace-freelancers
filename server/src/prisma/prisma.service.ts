import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    let retries = 5;
    while (retries > 0) {
      try {
        await this.$connect();
        break;
      } catch (err) {
        console.log(`Failed to connect to the database. Retries left: ${retries}`);
        retries -= 1;
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
    if (retries === 0) {
      throw new Error('Failed to connect to the database after multiple attempts');
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
