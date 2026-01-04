import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hospital } from './entities/hospital.entity';
import { SearchHospitalsDto } from './dto/search-hospitals.dto';

@Injectable()
export class HospitalsService {
  constructor(
    @InjectRepository(Hospital)
    private hospitalsRepository: Repository<Hospital>,
  ) {}

  async searchNearby(searchDto: SearchHospitalsDto) {
    const {
      latitude,
      longitude,
      radius,
      type,
      page = 1,
      limit = 20,
    } = searchDto;

    // Formule Haversine pour calculer la distance
    const query = this.hospitalsRepository
      .createQueryBuilder('hospital')
      .select([
        'hospital.*',
        `(
          6371 * acos(
            cos(radians(${latitude})) 
            * cos(radians(hospital.latitude)) 
            * cos(radians(hospital.longitude) - radians(${longitude})) 
            + sin(radians(${latitude})) 
            * sin(radians(hospital.latitude))
          )
        ) AS distance`,
      ])
      .where('hospital.isActive = :isActive', { isActive: true })
      .having(`distance <= :radius`, { radius })
      .orderBy('distance', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    if (type) {
      query.andWhere('hospital.type = :type', { type });
    }

    const hospitals = await query.getRawMany();

    return {
      data: hospitals,
      pagination: {
        page,
        limit,
        total: hospitals.length,
      },
    };
  }

  async findOne(id: string) {
    const hospital = await this.hospitalsRepository.findOne({
      where: { id, isActive: true },
      relations: ['services'],
    });

    if (!hospital) {
      throw new NotFoundException('Hospital not found');
    }

    return hospital;
  }

  async getServices(hospitalId: string) {
    const hospital = await this.findOne(hospitalId);
    return hospital.services;
  }

  async updateAverageRating(hospitalId: string) {
    const hospital = await this.hospitalsRepository.findOne({
      where: { id: hospitalId },
      relations: ['services'],
    });

    if (!hospital) return;

    const services = hospital.services;
    if (services.length === 0) {
      hospital.averageRating = 0;
      hospital.totalRatings = 0;
    } else {
      const totalRating = services.reduce(
        (sum, service) => sum + service.averageRating * service.totalRatings,
        0,
      );
      const totalCount = services.reduce(
        (sum, service) => sum + service.totalRatings,
        0,
      );

      hospital.averageRating = totalCount > 0 ? totalRating / totalCount : 0;
      hospital.totalRatings = totalCount;
    }

    await this.hospitalsRepository.save(hospital);
  }
}
