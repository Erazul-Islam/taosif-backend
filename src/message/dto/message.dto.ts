import { IsEmail, IsString } from 'class-validator';

export class SendMessageDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  content!: string;
}
