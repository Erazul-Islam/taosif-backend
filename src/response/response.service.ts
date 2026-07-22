import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SubmitResponseDto } from './dto/submit-response.dto';

@Injectable()
export class ResponseService {
  constructor(private readonly prisma: PrismaService) {}

  async submit(
    slug: string,
    dto: SubmitResponseDto,
    ipAddress?: string,
    userAgent?: string,
  ) {
    /**
     * Find Survey
     */
    const survey = await this.prisma.survey.findUnique({
      where: {
        slug,
      },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!survey) {
      throw new NotFoundException('Survey not found');
    }

    /**
     * Check Status
     */
    // if (survey.status !== SurveyStatus.PUBLISHED) {
    //   throw new BadRequestException('Survey is not accepting responses.');
    // }

    /**
     * Check Start Date
     */
    const now = new Date();

    if (survey.startsAt && now < survey.startsAt) {
      throw new BadRequestException('Survey has not started yet.');
    }

    /**
     * Check End Date
     */
    if (survey.endsAt && now > survey.endsAt) {
      throw new BadRequestException('Survey has already ended.');
    }

    /**
     * Prevent duplicate question ids
     */
    const submittedQuestionIds = dto.answers.map((a) => a.questionId);

    const duplicateIds = submittedQuestionIds.filter(
      (id, index) => submittedQuestionIds.indexOf(id) !== index,
    );

    if (duplicateIds.length > 0) {
      throw new BadRequestException('Duplicate questions submitted.');
    }

    /**
     * Validate Questions
     */

    const surveyQuestionMap = new Map(survey.questions.map((q) => [q.id, q]));

    /**
     * Every submitted question must belong to survey
     */
    for (const answer of dto.answers) {
      if (!surveyQuestionMap.has(answer.questionId)) {
        throw new BadRequestException(
          `Invalid question id: ${answer.questionId}`,
        );
      }
    }

    /**
     * Required Questions
     */
    const requiredQuestions = survey.questions.filter((q) => q.required);

    for (const question of requiredQuestions) {
      const found = dto.answers.find((a) => a.questionId === question.id);

      if (!found) {
        throw new BadRequestException(`${question.title} is required.`);
      }
    }

    /**
     * Validate Values
     */

    for (const answer of dto.answers) {
      const question = surveyQuestionMap.get(answer.questionId);

      if (!question) {
        throw new BadRequestException(
          `Invalid question id: ${answer.questionId}`,
        );
      }

      switch (question.type) {
        case 'SHORT_TEXT':
        case 'LONG_TEXT':
        case 'EMAIL':
        case 'PHONE':
          if (typeof answer.value !== 'string') {
            throw new BadRequestException(`${question.title} must be text.`);
          }
          break;

        case 'NUMBER':
          if (typeof answer.value !== 'number') {
            throw new BadRequestException(`${question.title} must be number.`);
          }
          break;

        case 'DATE':
          if (isNaN(Date.parse(answer.value))) {
            throw new BadRequestException(
              `${question.title} must be valid date.`,
            );
          }
          break;

        case 'RADIO':
        case 'SELECT': {
          if (typeof answer.value !== 'string') {
            throw new BadRequestException(`${question.title} is invalid.`);
          }

          const valid = question.options.some((o) => o.value === answer.value);

          if (!valid) {
            throw new BadRequestException(
              `${question.title} contains invalid option.`,
            );
          }

          break;
        }

        case 'CHECKBOX': {
          if (!Array.isArray(answer.value)) {
            throw new BadRequestException(`${question.title} must be array.`);
          }

          const optionValues = question.options.map((o) => o.value);

          for (const value of answer.value) {
            if (!optionValues.includes(value)) {
              throw new BadRequestException(
                `${question.title} contains invalid option.`,
              );
            }
          }

          break;
        }

        case 'RATING':
          if (typeof answer.value !== 'number') {
            throw new BadRequestException(`${question.title} must be number.`);
          }

          break;

        default:
          break;
      }
    }

    /**
     * Save Everything
     */

    const response = await this.prisma.$transaction(async (tx) => {
      const createdResponse = await tx.response.create({
        data: {
          surveyId: survey.id,
          ipAddress,
          userAgent,
        },
      });

      await tx.answer.createMany({
        data: dto.answers.map((answer) => ({
          responseId: createdResponse.id,
          questionId: answer.questionId,
          value: answer.value,
        })),
      });

      return createdResponse;
    });

    return {
      success: true,
      message: 'Survey submitted successfully.',
      data: response,
    };
  }

  async getResponses(surveyId: string) {
    const responses = await this.prisma.response.findMany({
      where: {
        surveyId,
      },
      include: {
        answers: {
          include: {
            question: true,
          },
        },
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });

    return responses;
  }

  async getResponse(id: string) {
    const response = await this.prisma.response.findUnique({
      where: {
        id,
      },
      include: {
        answers: {
          include: {
            question: true,
          },
        },
        survey: true,
      },
    });

    if (!response) {
      throw new NotFoundException('Response not found');
    }

    return response;
  }

  async getPublicSurvey(slug: string) {
    const survey = await this.prisma.survey.findUnique({
      where: {
        slug,
      },
      include: {
        questions: {
          orderBy: {
            order: 'asc',
          },
          include: {
            options: {
              orderBy: {
                order: 'asc',
              },
            },
          },
        },
      },
    });

    if (!survey) {
      throw new NotFoundException('Survey not found.');
    }

    // if (survey.status !== SurveyStatus.PUBLISHED) {
    //   throw new BadRequestException('Survey is not available.');
    // }

    return survey;
  }
}
