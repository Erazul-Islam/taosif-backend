import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { SurveyService } from './survey.service';
import { CreateSurveyDto } from './dto/survey.dto';

@Controller('surveys')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Post()
  async create(@Body() dto: CreateSurveyDto) {
    const survey: any = await this.surveyService.create(dto);
    return {
      statusCode: 201,
      message: 'Survey created successfully',
      data: survey,
    };
  }

  @Get()
  async findAll() {
    const surveys: any = await this.surveyService.findAll();
    return {
      statusCode: 200,
      message: 'Surveys retrieved successfully',
      data: surveys,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const survey: any = await this.surveyService.findOne(id);
    return {
      statusCode: 200,
      message: 'Survey retrieved successfully',
      data: survey,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: CreateSurveyDto) {
    const survey: any = await this.surveyService.update(id, dto);
    return {
      statusCode: 200,
      message: 'Survey updated successfully',
      data: survey,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const survey = await this.surveyService.remove(id);
    return {
      statusCode: 200,
      message: 'Survey removed successfully',
      data: survey,
    };
  }
}
