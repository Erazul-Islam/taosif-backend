/* eslint-disable */
import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { SendmessageService } from './message.service';
import { SendMessageDto } from './dto/message.dto';
import { Request } from 'express';

@Controller('message')
export class SendmessageController {
  constructor(private readonly sendMessageService: SendmessageService) {}

  @Post()
  async sendMessage(@Body() sendMessageDto: SendMessageDto, @Req() req : Request) {

    const sendMessage =
      await this.sendMessageService.sendMessage(sendMessageDto, req.ip as string);
    return {
      statusCode: 201,
      message: 'Message sent successfully',
      data: sendMessage,
    };
  }

  // @Post('notify')
  // async sendNotification(@Body('token') token: string) {
  //   const response = await this.sendMessageService.sendnotification(token);
  //   console.log(response)
  //   return {
  //     statusCode: 200,
  //     message: 'Notification sent successfully',
  //     data: response,
  //   };
  // }

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
