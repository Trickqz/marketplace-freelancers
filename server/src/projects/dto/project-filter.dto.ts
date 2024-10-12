import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';

export class ProjectFilterDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @IsOptional()
  @IsNumber()
  minBudget?: number;

  @IsOptional()
  @IsNumber()
  maxBudget?: number;

  @IsOptional()
  @IsDateString()
  deadlineAfter?: string;

  @IsOptional()
  @IsDateString()
  deadlineBefore?: string;
}

