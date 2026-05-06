import { GoogleGenAI } from '@google/genai';
import { Injectable } from '@nestjs/common';
// import { GenerateTextDto } from './dto/geminit.dto';

@Injectable()
export class GeminiService {
  private gemini: GoogleGenAI;

  constructor() {
    this.gemini = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  async generateText(prompt: string) {
    const response = await this.gemini.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  }
}
