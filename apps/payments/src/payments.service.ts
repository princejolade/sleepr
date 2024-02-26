import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientGrpc } from '@nestjs/microservices';
import Stripe from 'stripe';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';
import {
  NOTIFICATIONS_SERVICE_NAME,
  NotificationsServiceClient,
} from '@app/common';

@Injectable()
export class PaymentsService implements OnModuleInit {
  private notificationsService: NotificationsServiceClient;

  private readonly stripe = new Stripe(
    this.configService.get('STRIPE_SECRET_KEY'),
    {
      apiVersion: '2023-10-16',
    },
  );

  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE_NAME)
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.notificationsService =
      this.client.getService<NotificationsServiceClient>(
        NOTIFICATIONS_SERVICE_NAME,
      );
  }

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

    this.notificationsService
      .notifyEmail({
        email,
        text: `Your payment of ${paymentIntent.currency.toUpperCase()} ${paymentIntent.amount / 100} has completed successfully.`,
      })
      .subscribe();

    return paymentIntent;
  }
}
