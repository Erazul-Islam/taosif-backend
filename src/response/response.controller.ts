import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { ResponseService } from './response.service';
import { SubmitResponseDto } from './dto/submit-response.dto';

@Controller()
export class ResponseController {
  constructor(private readonly responseService: ResponseService) {}

  /**
   * Submit Survey Response
   * POST /public/surveys/:slug/submit
   */
  @Post('public/surveys/:slug/submit')
  async submitSurvey(
    @Param('slug') slug: string,
    @Body() dto: SubmitResponseDto,
    @Req() req: Request,
  ) {
    return this.responseService.submit(
      slug,
      dto,
      req.ip,
      req.headers['user-agent'],
    );
  }

  /**
   * Get all responses of a survey (Admin)
   * GET /surveys/:surveyId/responses
   */
  @Get('surveys/:surveyId/responses')
  async getResponses(@Param('surveyId') surveyId: string) {
    return this.responseService.getResponses(surveyId);
  }

  /**
   * Get a single response (Admin)
   * GET /responses/:id
   */
  @Get('responses/:id')
  async getResponse(@Param('id') id: string) {
    return this.responseService.getResponse(id);
  }

  @Get('public/surveys/:slug')
  getPublicSurvey(@Param('slug') slug: string) {
    return this.responseService.getPublicSurvey(slug);
  }
}
