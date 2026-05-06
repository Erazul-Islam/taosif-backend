import { Body, Controller, Post } from '@nestjs/common';
import { GeminiService } from './gemini.service';
// import { GenerateTextDto } from './dto/geminit.dto';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post()
  async generateText(@Body('prompt') prompt: string) {
    const generatedText = await this.geminiService.generateText(prompt);
    return {
      statusCode: 201,
      message: 'Response generated successfully',
      generatedText,
    };
  }
}
