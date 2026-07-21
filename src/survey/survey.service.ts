import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

import slugify from 'slugify';
import { CreateSurveyDto } from './dto/survey.dto';

@Injectable()
export class SurveyService {
  constructor(private prisma: PrismaService) {}

  private get db() {
    return this.prisma as any;
  }

  async create(dto: CreateSurveyDto): Promise<any> {
    let slug = slugify(dto.title, {
      lower: true,
      strict: true,
      trim: true,
    });

    const exists = await this.db.survey.findUnique({
      where: { slug },
    });

    if (exists) {
      slug += `-${Date.now()}`;
    }

    const survey = await this.db.survey.create({
      data: {
        ...dto,
        slug,
        startsAt: dto.startsAt ? new Date(dto.startsAt) : null,
        endsAt: dto.endsAt ? new Date(dto.endsAt) : null,
      },
    });

    return survey;
  }

  async findAll(): Promise<any> {
    return await this.db.survey.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: {
            questions: true,
            responses: true,
          },
        },
      },
    });
  }

  async findOne(id: string): Promise<any> {
    const survey = await this.db.survey.findUnique({
      where: { id },
      include: {
        questions: {
          include: {
            options: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!survey) {
      throw new NotFoundException('Survey not found');
    }

    return survey;
  }

  async update(id: string, dto: CreateSurveyDto): Promise<any> {
    await this.findOne(id);

    return await this.db.survey.update({
      where: { id },
      data: {
        ...dto,
        startsAt: dto.startsAt ? new Date(dto.startsAt) : undefined,
        endsAt: dto.endsAt ? new Date(dto.endsAt) : undefined,
      },
    });
  }

  async remove(id: string): Promise<any> {
    await this.findOne(id);

    await this.db.survey.delete({
      where: { id },
    });

    return {
      message: 'Survey deleted successfully',
    };
  }
}
