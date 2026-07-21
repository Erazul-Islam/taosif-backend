import { Module } from '@nestjs/common';
import { ResponseController } from './response.controller';
import { ResponseService } from './response.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ResponseController],
  providers: [ResponseService, PrismaService],
})
export class ResponseModule {}
