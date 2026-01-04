import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './entities/rating.entity';
import { Service } from '../services/entities/service.entity';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { HospitalsService } from '../hospitals/hospitals.service';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private ratingsRepository: Repository<Rating>,
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
    private hospitalsService: HospitalsService,
  ) {}

  async create(userId: string, createRatingDto: CreateRatingDto) {
    const { serviceId, rating, comment } = createRatingDto;

    // Vérifier si le service existe
    const service = await this.servicesRepository.findOne({
      where: { id: serviceId },
      relations: ['hospital'],
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // Vérifier si l'utilisateur a déjà noté ce service
    const existingRating = await this.ratingsRepository.findOne({
      where: { user: { id: userId }, service: { id: serviceId } },
    });

    if (existingRating) {
      throw new ConflictException('You have already rated this service');
    }

    // Créer la note
    const newRating = this.ratingsRepository.create({
      rating,
      comment,
      user: { id: userId },
      service: { id: serviceId },
    });

    await this.ratingsRepository.save(newRating);

    // Mettre à jour la moyenne du service
    await this.updateServiceRating(serviceId);

    // Mettre à jour la moyenne de l'hôpital
    await this.hospitalsService.updateAverageRating(service.hospital.id);

    return newRating;
  }

  async update(
    userId: string,
    ratingId: string,
    updateRatingDto: UpdateRatingDto,
  ) {
    const rating = await this.ratingsRepository.findOne({
      where: { id: ratingId },
      relations: ['user', 'service', 'service.hospital'],
    });

    if (!rating) {
      throw new NotFoundException('Rating not found');
    }

    if (rating.user.id !== userId) {
      throw new ForbiddenException('You can only update your own ratings');
    }

    Object.assign(rating, updateRatingDto);
    await this.ratingsRepository.save(rating);

    // Mettre à jour les moyennes
    await this.updateServiceRating(rating.service.id);
    await this.hospitalsService.updateAverageRating(rating.service.hospital.id);

    return rating;
  }

  async delete(userId: string, ratingId: string) {
    const rating = await this.ratingsRepository.findOne({
      where: { id: ratingId },
      relations: ['user', 'service', 'service.hospital'],
    });

    if (!rating) {
      throw new NotFoundException('Rating not found');
    }

    if (rating.user.id !== userId) {
      throw new ForbiddenException('You can only delete your own ratings');
    }

    const serviceId = rating.service.id;
    const hospitalId = rating.service.hospital.id;

    await this.ratingsRepository.remove(rating);

    // Mettre à jour les moyennes
    await this.updateServiceRating(serviceId);
    await this.hospitalsService.updateAverageRating(hospitalId);

    return { message: 'Rating deleted successfully' };
  }

  async findByService(serviceId: string, page = 1, limit = 20) {
    const [ratings, total] = await this.ratingsRepository.findAndCount({
      where: { service: { id: serviceId }, isPublished: true },
      relations: ['user'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: ratings,
      pagination: { page, limit, total },
    };
  }

  private async updateServiceRating(serviceId: string) {
    const result = await this.ratingsRepository
      .createQueryBuilder('rating')
      .select('AVG(rating.rating)', 'average')
      .addSelect('COUNT(rating.id)', 'count')
      .where('rating.serviceId = :serviceId', { serviceId })
      .andWhere('rating.isPublished = :isPublished', { isPublished: true })
      .getRawOne();

    const service = await this.servicesRepository.findOne({
      where: { id: serviceId },
    });

    if (service) {
      service.averageRating = parseFloat(result.average) || 0;
      service.totalRatings = parseInt(result.count) || 0;
      await this.servicesRepository.save(service);
    }
  }
}
