import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { CardDto } from './card.dto';
import { Type } from 'class-transformer';
import { CreateChargeMessage } from '../types/payments';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateChargeDto implements Omit<CreateChargeMessage, 'email'> {
  @IsDefined()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CardDto)
  @Field(() => CardDto)
  card: CardDto;

  @IsNumber()
  @Field()
  amount: number;
}
