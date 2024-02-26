import {
  IsCreditCard,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
} from 'class-validator';
import { CardMessage } from '../types/payments';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CardDto implements CardMessage {
  @IsNumberString()
  @IsNotEmpty()
  @Field()
  cvc: string;

  @IsNumber()
  @Field()
  expMonth: number;

  @IsNumber()
  @Field()
  expYear: number;

  @IsCreditCard()
  @Field()
  number: string;
}
