import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Guest } from './guest.entity';
import { Room } from './room.entity';
import { AccompanyingGuest } from './accompanying-guest.entity';
import { PolicyAcknowledgment } from './policy-acknowledgment.entity';
import { Transaction } from './transaction.entity';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  reservationNumber!: string;

  @Column({ type: 'date' })
  checkInDate!: Date;

  @Column({ type: 'date' })
  checkOutDate!: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  vehiclePlateNumber?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.reservations)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  userId!: string;

  @ManyToOne(() => Guest, (guest) => guest.reservations)
  @JoinColumn({ name: 'guestId' })
  guest!: Guest;

  @Column()
  guestId!: string;

  @OneToMany(() => Room, (room) => room.reservation)
  rooms!: Room[];

  @OneToMany(() => AccompanyingGuest, (guest) => guest.reservation)
  accompanyingGuests!: AccompanyingGuest[];

  @OneToMany(() => PolicyAcknowledgment, (policy) => policy.reservation)
  policyAcknowledgments!: PolicyAcknowledgment[];

  @OneToMany(() => Transaction, (transaction) => transaction.reservation)
  transactions!: Transaction[];
}
