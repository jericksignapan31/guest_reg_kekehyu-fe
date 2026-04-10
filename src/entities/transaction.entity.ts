import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Reservation } from './reservation.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  action!: string;

  @Column({ type: 'text', nullable: true })
  details?: string;

  @CreateDateColumn()
  timestamp!: Date;

  @ManyToOne(() => User, (user) => user.transactions)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  userId!: string;

  @ManyToOne(() => Reservation, (reservation) => reservation.transactions, { nullable: true })
  @JoinColumn({ name: 'reservationId' })
  reservation?: Reservation;

  @Column({ nullable: true })
  reservationId?: string;
}
