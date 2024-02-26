import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotifyEmailDto } from './dto/notify-email.dto';
import {
  NotificationsServiceController,
  NotificationsServiceControllerMethods,
} from '@app/common';

@Controller()
@NotificationsServiceControllerMethods()
export class NotificationsController implements NotificationsServiceController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async notifyEmail(data: NotifyEmailDto) {
    this.notificationsService.notifyEmail(data);
  }
}
