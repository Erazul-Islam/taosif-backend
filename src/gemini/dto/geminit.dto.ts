import { IsString, IsNotEmpty } from 'class-validator';

export class GenerateTextDto {
  @IsString()
  @IsNotEmpty()
  message!: string;
}
