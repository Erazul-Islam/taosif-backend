// dto/create-question.dto.ts

import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
  ArrayMinSize,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionType } from 'src/generated/prisma/browser';

class CreateOptionDto {
  @IsString()
  label!: string;

  @IsString()
  value!: string;

  @IsInt()
  order!: number;
}

export class CreateQuestionDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(QuestionType)
  type!: QuestionType;

  @IsBoolean()
  required!: boolean;

  @IsInt()
  order!: number;

  @IsOptional()
  @IsString()
  placeholder?: string;

  @ValidateIf((o) => ['RADIO', 'CHECKBOX', 'SELECT'].includes(o.type))
  @IsArray()
  @ArrayMinSize(2)
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  options?: CreateOptionDto[];
}
