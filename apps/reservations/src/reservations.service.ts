import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { ClientGrpc } from '@nestjs/microservices';
import { map } from 'rxjs';
import {
  PAYMENTS_SERVICE_NAME,
  PaymentsServiceClient,
} from '@app/common/types/payments';
import { UserDto } from '@app/common';

@Injectable()
export class ReservationsService implements OnModuleInit {
  private paymentsService: PaymentsServiceClient;
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
    @Inject(PAYMENTS_SERVICE_NAME)
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.paymentsService = this.client.getService<PaymentsServiceClient>(
      PAYMENTS_SERVICE_NAME,
    );
  }

  async create(
    createReservationDto: CreateReservationDto,
    { email, _id: userId }: UserDto,
  ) {
    return this.paymentsService
      .createCharge({ ...createReservationDto.charge, email })
      .pipe(
        map((response) => {
          return this.reservationsRepository.create({
            ...createReservationDto,
            timestamp: new Date(),
            userId,
            invoiceId: response.id,
          });
        }),
      );
  }

  async findAll() {
    return this.reservationsRepository.find();
  }

  async findOne(id: string) {
    return this.reservationsRepository.findOne({ _id: id });
  }

  async update(id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationsRepository.findOneAndUpdate(
      { _id: id },
      {
        $set: updateReservationDto,
      },
    );
  }

  async remove(id: string) {
    return this.reservationsRepository.findOneAndDelete({ _id: id });
  }
}
