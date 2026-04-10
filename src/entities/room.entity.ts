import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Reservation } from './reservation.entity';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  roomType!: string;

  @Column({ type: 'varchar', length: 50 })
  roomNumber!: string;

  @Column({ type: 'time', default: '14:00:00' })
  checkInTime!: string;

  @Column({ type: 'time', default: '11:00:00' })
  checkOutTime!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => Reservation, (reservation) => reservation.rooms, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reservationId' })
  reservation!: Reservation;

  @Column()
  reservationId!: string;
}
