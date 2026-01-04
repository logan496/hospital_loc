import { IsInt, Min, Max, IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRatingDto {
  @ApiProperty({
    example: '650e8400-e29b-41d4-a716-446655440001',
    description: 'ID du service à noter',
  })
  @IsUUID()
  serviceId: string;

  @ApiProperty({
    example: 5,
    description: 'Note de 1 à 5',
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({
    example: 'Excellent service, personnel très compétent',
    description: 'Commentaire optionnel',
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
