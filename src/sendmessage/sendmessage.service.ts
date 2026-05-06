/* eslint-disable */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class SendmessageService {
  constructor(private readonly prismaService: PrismaService) {}

  async sendMessage(message: SendMessageDto,ip:string) {
    console.log(ip)
    const sendMessage = await this.prismaService.sendMessage.create({
      data: {
        name: message.name,
        email: message.email,
        content: message.content,
        ip: ip,
      },
    });
    return sendMessage;
  }

  async getAllMessages() {
    const messages = await this.prismaService.sendMessage.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return messages;
  }
}
