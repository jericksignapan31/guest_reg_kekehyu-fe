import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation, Transaction, User, UserRole } from '../../entities';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Reservation) private reservationRepository: Repository<Reservation>,
    @InjectRepository(Transaction) private transactionRepository: Repository<Transaction>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getDashboardStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const todayReservations = await this.reservationRepository
      .createQueryBuilder('reservation')
      .where('reservation.checkInDate >= :today', { today })
      .andWhere('reservation.checkInDate < :tomorrow', { tomorrow })
      .getCount();

    const weekReservations = await this.reservationRepository
      .createQueryBuilder('reservation')
      .where('reservation.checkInDate >= :weekAgo', { weekAgo })
      .andWhere('reservation.checkInDate <= :today', { today })
      .getCount();

    const monthReservations = await this.reservationRepository
      .createQueryBuilder('reservation')
      .where('reservation.checkInDate >= :monthAgo', { monthAgo })
      .andWhere('reservation.checkInDate <= :today', { today })
      .getCount();

    const totalReservations = await this.reservationRepository.count();

    return {
      today: todayReservations,
      week: weekReservations,
      month: monthReservations,
      total: totalReservations,
      timestamp: new Date(),
    };
  }

  async getTransactionHistory(page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;

    const [transactions, total] = await this.transactionRepository.findAndCount({
      relations: ['user', 'reservation'],
      skip,
      take: limit,
      order: { timestamp: 'DESC' },
    });

    return {
      data: transactions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getTransactionsByUser(userId: string, page: number = 1, limit: number = 50) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const skip = (page - 1) * limit;

    const [transactions, total] = await this.transactionRepository.findAndCount({
      where: { userId },
      relations: ['user', 'reservation'],
      skip,
      take: limit,
      order: { timestamp: 'DESC' },
    });

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
        contactNumber: user.contactNumber,
        email: user.email,
        role: user.role,
      },
      data: transactions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getAllFrontdeskUsers() {
    return this.userRepository.find({
      where: { role: UserRole.FRONTDESK },
      select: ['id', 'firstName', 'lastName', 'middleName', 'contactNumber', 'email', 'createdAt', 'updatedAt'],
    });
  }

  async getUserStatistics(userId: string) {
    const registrations = await this.reservationRepository.count({
      where: { userId },
    });

    const transactions = await this.transactionRepository.count({
      where: { userId },
    });

    const recentActivity = await this.transactionRepository.find({
      where: { userId },
      order: { timestamp: 'DESC' },
      take: 10,
      relations: ['reservation'],
    });

    return {
      userId,
      registrations,
      transactions,
      recentActivity,
    };
  }
}
