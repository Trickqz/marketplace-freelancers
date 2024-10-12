import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  receiverId: number;

  @IsNumber()
  projectId: number;
}

