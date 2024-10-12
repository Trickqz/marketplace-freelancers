import { IsString, IsNumber, IsDateString, IsOptional } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  budget: number;

  @IsDateString()
  deadline: string;

  @IsNumber()
  @IsOptional()
  categoryId?: number;
}
