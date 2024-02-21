import { CreateChargeDto } from '@app/common';

export class PaymentsCreateChargeDto extends CreateChargeDto {
  email: string;
}
