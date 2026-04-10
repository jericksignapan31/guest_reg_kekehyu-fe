import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation, Guest, Room, AccompanyingGuest, PolicyAcknowledgment, Transaction } from '../../entities';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, Guest, Room, AccompanyingGuest, PolicyAcknowledgment, Transaction]),
    AuthModule,
  ],
  controllers: [ReservationController],
  providers: [ReservationService],
  exports: [ReservationService],
})
export class ReservationModule {}
