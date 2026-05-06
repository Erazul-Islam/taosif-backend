import { Module } from '@nestjs/common';
import { SendmessageController } from './sendmessage.controller';
import { SendmessageService } from './sendmessage.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [SendmessageController],
  providers: [SendmessageService, PrismaService],
})
export class SendmessageModule {}
