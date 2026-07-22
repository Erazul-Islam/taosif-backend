import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateQuestionDto } from './dto/question.dto';

@Injectable()
export class QuestionService {
  constructor(private prisma: PrismaService) {}

  private readonly OPTION_BASED_TYPES: string[] = [
    'RADIO',
    'CHECKBOX',
    'SELECT',
  ];

  async create(surveyId: string, dto: CreateQuestionDto) {
    const survey = await this.prisma.survey.findUnique({
      where: { id: surveyId },
    });

    if (!survey) {
      throw new NotFoundException('Survey not found');
    }

    const isOptionBased = this.OPTION_BASED_TYPES.includes(dto.type);
    const hasOptions = dto.options && dto.options.length > 0;

    if (isOptionBased && !hasOptions) {
      throw new BadRequestException(
        `Question type '${dto.type}' requires at least two options.`,
      );
    }

    if (!isOptionBased && hasOptions) {
      throw new BadRequestException(
        `Question type '${dto.type}' cannot have options provided.`,
      );
    }

    return this.prisma.question.create({
      data: {
        surveyId,
        title: dto.title,
        description: dto.description,
        type: dto.type,
        required: dto.required,
        order: dto.order,
        placeholder: dto.placeholder,
        options: dto.options
          ? {
              create: dto.options,
            }
          : undefined,
      },

      include: {
        options: true,
      },
    });
  }

  async findAll(surveyId: string) {
    const questions = await this.prisma.question.findMany({
      where: {
        surveyId,
      },

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
    });
    return questions;
  }

  async delete(id: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    await this.prisma.question.delete({
      where: { id },
    });

    return question;
  }
}
