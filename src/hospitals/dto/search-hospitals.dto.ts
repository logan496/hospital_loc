import { IsNumber, IsOptional, Min, Max, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HospitalType } from '../entities/hospital.entity';

export class SearchHospitalsDto {
  @ApiProperty({
    example: 4.05,
    description: "Latitude de la position de l'utilisateur",
  })
  @IsNumber()
  @Type(() => Number)
  latitude: number;

  @ApiProperty({
    example: 9.7,
    description: "Longitude de la position de l'utilisateur",
  })
  @IsNumber()
  @Type(() => Number)
  longitude: number;

  @ApiPropertyOptional({
    example: 10,
    description: 'Rayon de recherche en km (par défaut: 10)',
    default: 10,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  radius?: number = 10;

  @ApiPropertyOptional({
    enum: HospitalType,
    description: "Type d'établissement",
  })
  @IsOptional()
  @IsEnum(HospitalType)
  type?: HospitalType;

  @ApiPropertyOptional({
    example: 1,
    description: 'Numéro de page',
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    example: 20,
    description: 'Nombre de résultats par page',
    default: 20,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
