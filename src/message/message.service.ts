/* eslint-disable */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SendMessageDto } from './dto/message.dto';
// import admin from 'src/config/admin.firebase';

@Injectable()
export class SendmessageService {
  constructor(private readonly prismaService: PrismaService) { }

  async sendMessage(message: SendMessageDto, ip: string) {
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

  // async sendnotification(token: string) {
  //   try {
  //     const response = await admin.messaging().send({
  //       token: token,
  //       notification: {
  //         title: 'New Message',
  //         body: 'You have a new message from your website contact form.',
  //       },
  //       data: {
  //         type: 'Portfolio Message',
  //       }
  //     })
  //     console.log(response)
  //     return response;
  //   }
  //   catch (error) {
  //     console.error(error);
  //     throw error;
  //   }
  // }

  async getAllMessages() {
    const messages = await this.prismaService.sendMessage.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return messages;
  }
}
