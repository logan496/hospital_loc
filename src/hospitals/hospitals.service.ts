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
    const { latitude, longitude, radius, type, page = 1, limit = 20 } = searchDto;

    // Construction de la requête SQL brute avec sous-requête
    let query = `
      SELECT * FROM (
        SELECT 
          hospital.*,
          (
            6371 * acos(
              cos(radians(${latitude})) 
              * cos(radians(hospital.latitude)) 
              * cos(radians(hospital.longitude) - radians(${longitude})) 
              + sin(radians(${latitude})) 
              * sin(radians(hospital.latitude))
            )
          ) AS distance
        FROM hospitals hospital
        WHERE hospital."isActive" = true
    `;

    // Ajouter le filtre de type si nécessaire
    if (type) {
      query += ` AND hospital.type = '${type}'`;
    }

    query += `
      ) AS results
      WHERE distance <= ${radius}
      ORDER BY distance ASC
      LIMIT ${limit}
      OFFSET ${(page - 1) * limit}
    `;

    const hospitals = await this.hospitalsRepository.query(query);

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
      const totalRating = services.reduce((sum, service) => sum + service.averageRating * service.totalRatings, 0);
      const totalCount = services.reduce((sum, service) => sum + service.totalRatings, 0);

      hospital.averageRating = totalCount > 0 ? totalRating / totalCount : 0;
      hospital.totalRatings = totalCount;
    }

    await this.hospitalsRepository.save(hospital);
  }
}