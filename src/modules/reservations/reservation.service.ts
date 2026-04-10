import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation, Guest, Room, AccompanyingGuest, PolicyAcknowledgment, User, Transaction } from '../../entities';
import { CreateReservationDto, CreateGuestDto } from './dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation) private reservationRepository: Repository<Reservation>,
    @InjectRepository(Guest) private guestRepository: Repository<Guest>,
    @InjectRepository(Room) private roomRepository: Repository<Room>,
    @InjectRepository(AccompanyingGuest) private accompanyingGuestRepository: Repository<AccompanyingGuest>,
    @InjectRepository(PolicyAcknowledgment) private policyAcknowledgmentRepository: Repository<PolicyAcknowledgment>,
    @InjectRepository(Transaction) private transactionRepository: Repository<Transaction>,
  ) {}

  async createReservation(createReservationDto: CreateReservationDto, userId: string) {
    const { guest, rooms, accompanyingGuests, policies, ...reservationData } = createReservationDto;

    // Create guest
    const newGuest = this.guestRepository.create({
      firstName: guest.firstName,
      lastName: guest.lastName,
      middleName: guest.middleName,
      phone: guest.phone,
      email: guest.email,
      country: guest.country,
      idNumber: guest.idNumber,
      idType: guest.idType,
    });
    const savedGuest = await this.guestRepository.save(newGuest);

    // Generate reservation number
    const reservationNumber = `RES-${Date.now()}-${uuidv4().slice(0, 8).toUpperCase()}`;

    // Create reservation (without room-specific fields)
    const reservation = this.reservationRepository.create({
      checkInDate: reservationData.checkInDate,
      checkOutDate: reservationData.checkOutDate,
      vehiclePlateNumber: reservationData.vehiclePlateNumber,
      reservationNumber,
      guestId: savedGuest.id,
      userId,
    });
    const savedReservation: Reservation = await this.reservationRepository.save(reservation);

    // Save rooms
    if (rooms && rooms.length > 0) {
      for (const roomData of rooms) {
        const room = this.roomRepository.create({
          ...roomData,
          checkInTime: roomData.checkInTime || '14:00:00',
          checkOutTime: roomData.checkOutTime || '11:00:00',
          reservationId: savedReservation.id,
        });
        await this.roomRepository.save(room);
      }
    }

    // Save accompanying guests
    if (accompanyingGuests && accompanyingGuests.length > 0) {
      for (const guestData of accompanyingGuests) {
        const accGuest = this.accompanyingGuestRepository.create({
          ...guestData,
          reservationId: savedReservation.id,
        });
        await this.accompanyingGuestRepository.save(accGuest);
      }
    }

    // Save policy acknowledgments
    if (policies) {
      const policyAck = this.policyAcknowledgmentRepository.create({
        ...policies,
        reservationId: savedReservation.id,
      });
      await this.policyAcknowledgmentRepository.save(policyAck);
    }

    // Log transaction
    const fullName = guest.middleName ? `${guest.firstName} ${guest.middleName} ${guest.lastName}` : `${guest.firstName} ${guest.lastName}`;
    const transaction = this.transactionRepository.create({
      userId,
      reservationId: savedReservation.id,
      action: 'GUEST_REGISTERED',
      details: `Guest ${fullName} registered by frontdesk`,
    });
    await this.transactionRepository.save(transaction);

    return {
      id: savedReservation.id,
      reservationNumber,
      guest: savedGuest,
      message: 'Reservation created successfully',
    };
  }

  async getReservationsByUser(userId: string) {
    return this.reservationRepository.find({
      where: { userId },
      relations: ['guest', 'rooms', 'accompanyingGuests', 'policyAcknowledgments'],
      order: { createdAt: 'DESC' },
    });
  }

  async getReservationById(reservationId: string) {
    const reservation = await this.reservationRepository.findOne({
      where: { id: reservationId },
      relations: ['guest', 'rooms', 'accompanyingGuests', 'policyAcknowledgments'],
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    return reservation;
  }

  async getAllReservations() {
    return this.reservationRepository.find({
      relations: ['guest', 'rooms', 'user', 'accompanyingGuests', 'policyAcknowledgments'],
      order: { createdAt: 'DESC' },
    });
  }

  async getReservationsByDateRange(startDate: Date, endDate: Date) {
    return this.reservationRepository
      .createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.guest', 'guest')
      .leftJoinAndSelect('reservation.user', 'user')
      .where('reservation.checkInDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .orderBy('reservation.createdAt', 'DESC')
      .getMany();
  }

  async getTodayReservations() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.getReservationsByDateRange(today, tomorrow);
  }

  async getWeekReservations() {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    return this.getReservationsByDateRange(weekAgo, today);
  }

  async getMonthReservations() {
    const today = new Date();
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    return this.getReservationsByDateRange(monthAgo, today);
  }
}
