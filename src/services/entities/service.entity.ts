import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Hospital } from '../../hospitals/entities/hospital.entity';
import { Rating } from '../../ratings/entities/rating.entity';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('decimal', { precision: 3, scale: 2, default: 0 })
  averageRating: number;

  @Column({ default: 0 })
  totalRatings: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  indicativePrice: number;

  @ManyToOne(() => Hospital, hospital => hospital.services, { onDelete: 'CASCADE' })
  hospital: Hospital;

  @OneToMany(() => Rating, rating => rating.service)
  ratings: Rating[];

  @CreateDateColumn()
  createdAt: Date;
}