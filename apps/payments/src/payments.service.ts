import { NOTIFICATIONS_SERVICE } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import Stripe from 'stripe';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(
    this.configService.get('STRIPE_SECRET_KEY'),
    {
      apiVersion: '2023-10-16',
    },
  );

  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationService: ClientProxy,
  ) {}

  async createCharge({ email, amount }: PaymentsCreateChargeDto) {
    /* const paymentMethod = await this.stripe.paymentMethods.create({
      type: 'card',
      card: card as unknown as Stripe.PaymentMethodCreateParams.Card1,
    });
 */
    const paymentIntent = await this.stripe.paymentIntents.create({
      //payment_method: paymentMethod.id,
      //payment_method_type: ["card"],
      amount: Math.round(amount * 100),
      confirm: true,
      currency: 'gbp',
      payment_method: 'pm_card_visa',
      automatic_payment_methods: { enabled: true, allow_redirects: 'never' },
    });

    this.notificationService.emit('notify_email', {
      email,
      text: `Your payment of ${paymentIntent.currency.toUpperCase()} ${paymentIntent.amount / 100} has completed successfully.`,
    });

    return paymentIntent;
  }
}
