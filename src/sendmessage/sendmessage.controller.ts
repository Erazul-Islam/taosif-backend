/* eslint-disable */
import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { SendmessageService } from './sendmessage.service';
import { SendMessageDto } from './dto/send-message.dto';
import { Request } from 'express';

@Controller('sendmessage')
export class SendmessageController {
  constructor(private readonly sendMessageService: SendmessageService) {}

  @Post()
  async sendMessage(@Body() sendMessageDto: SendMessageDto, @Req() req : Request) {
    console.log("IP Address:", req);
    const sendMessage =
      await this.sendMessageService.sendMessage(sendMessageDto, req.ip as string);
    return {
      statusCode: 201,
      message: 'Message sent successfully',
      data: sendMessage,
    };
  }

  @Get()
  async getAllMessages() {
    const messages = await this.sendMessageService.getAllMessages();
    return {
      statusCode: 200,
      message: 'Messages retrieved successfully',
      data: messages,
    };
  }
}
