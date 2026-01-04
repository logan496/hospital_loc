import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatingsService } from './ratings.service';
import { RatingsController } from './ratings.controller';
import { Rating } from './entities/rating.entity';
import { Service } from '../services/entities/service.entity';
import { HospitalsModule } from '../hospitals/hospitals.module';

@Module({
  imports: [TypeOrmModule.forFeature([Rating, Service]), HospitalsModule],
  controllers: [RatingsController],
  providers: [RatingsService],
})
export class RatingsModule {}
