import { IsString, IsNumber } from 'class-validator';

export class CreateProposalDto {
  @IsString()
  content: string;

  @IsNumber()
  price: number;
}

