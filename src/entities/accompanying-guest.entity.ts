import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Reservation } from './reservation.entity';

@Entity('accompanying_guests')
export class AccompanyingGuest {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  firstName!: string;

  @Column({ type: 'varchar', length: 100 })
  lastName!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  middleName?: string;

  @Column({ type: 'boolean', default: false })
  validIdPresented!: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  idType?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  idNumber?: string;

  @Column({ type: 'text', nullable: true })
  signature?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => Reservation, (reservation) => reservation.accompanyingGuests, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reservationId' })
  reservation!: Reservation;

  @Column()
  reservationId!: string;
}
