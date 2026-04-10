import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Reservation } from './reservation.entity';

@Entity('policy_acknowledgments')
export class PolicyAcknowledgment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'boolean', default: false })
  makeUpRoom!: boolean;

  @Column({ type: 'boolean', default: false })
  housekeepingStaff!: boolean;

  @Column({ type: 'boolean', default: false })
  smoking!: boolean;

  @Column({ type: 'boolean', default: false })
  corkage!: boolean;

  @Column({ type: 'boolean', default: false })
  noPets!: boolean;

  @Column({ type: 'boolean', default: false })
  damageDeductible!: boolean;

  @Column({ type: 'boolean', default: false })
  minorsCare!: boolean;

  @Column({ type: 'boolean', default: false })
  digitalSafe!: boolean;

  @Column({ type: 'boolean', default: false })
  dataPrivacy!: boolean;

  @Column({ type: 'text', nullable: true })
  guestSignature?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => Reservation, (reservation) => reservation.policyAcknowledgments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reservationId' })
  reservation!: Reservation;

  @Column()
  reservationId!: string;
}
