import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Service } from '../../services/entities/service.entity';

export enum HospitalType {
  HOSPITAL = 'hospital',
  CLINIC = 'clinic',
  CENTER = 'center',
}

@Entity('hospitals')
export class Hospital {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: HospitalType,
  })
  type: HospitalType;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column('decimal', { precision: 10, scale: 8 })
  @Index()
  latitude: number;

  @Column('decimal', { precision: 11, scale: 8 })
  @Index()
  longitude: number;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column('decimal', { precision: 3, scale: 2, default: 0 })
  averageRating: number;

  @Column({ default: 0 })
  totalRatings: number;

  @Column({ default: true })
  isActive: boolean;

  @Column('jsonb', { nullable: true })
  openingHours: any;

  @OneToMany(() => Service, service => service.hospital, { cascade: true })
  services: Service[];

  @CreateDateColumn()
  createdAt: Date;
}