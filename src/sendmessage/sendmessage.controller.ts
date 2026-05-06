/* eslint-disable */
import { Body, Controller, Get, Post } from '@nestjs/common';
import { SendmessageService } from './sendmessage.service';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('sendmessage')
export class SendmessageController {
  constructor(private readonly sendMessageService: SendmessageService) {}

  @Post()
  async sendMessage(@Body() sendMessageDto: SendMessageDto) {
    const sendMessage =
      await this.sendMessageService.sendMessage(sendMessageDto);
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
