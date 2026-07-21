import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/question.dto';

@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post(':surveyId')
  async create(
    @Body() dto: CreateQuestionDto,
    @Param('surveyId') surveyId: string,
  ) {
    const question = await this.questionService.create(surveyId, dto);
    return {
      statusCode: 201,
      message: 'Question created successfully',
      data: question,
    };
  }

  @Get(':surveyId')
  async findAll(@Param('surveyId') surveyId: string) {
    const questions = await this.questionService.findAll(surveyId);
    return {
      statusCode: 200,
      message: 'Questions retrieved successfully',
      data: questions,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const question = await this.questionService.delete(id);
    return {
      statusCode: 200,
      message: 'Question removed successfully',
      data: question,
    };
  }
}
