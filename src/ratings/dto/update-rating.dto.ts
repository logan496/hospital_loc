import { IsInt, Min, Max, IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRatingDto {
  @ApiPropertyOptional({
    example: 4,
    description: 'Nouvelle note de 1 à 5',
    minimum: 1,
    maximum: 5,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({
    example: 'Mise à jour de mon commentaire',
    description: 'Nouveau commentaire',
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
