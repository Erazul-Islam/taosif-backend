import { Module } from '@nestjs/common';
import { SendmessageController } from './message.controller';
import { SendmessageService } from './message.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [SendmessageController],
  providers: [SendmessageService, PrismaService],
})
export class MessageModule {}
