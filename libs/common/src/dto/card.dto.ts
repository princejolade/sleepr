import {
  IsCreditCard,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
} from 'class-validator';

export class CardDto {
  @IsNumberString()
  @IsNotEmpty()
  cvc: string;

  @IsNumber()
  exp_month: number;

  @IsNumber()
  exp_year: number;

  @IsCreditCard()
  number: string;
}
