import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: "Email de l'utilisateur",
  })
  @IsNotEmpty({ message: "L'email est requis" })
  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Mot de passe (min 8 caractères)',
    minLength: 8,
  })
  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
  @MinLength(8, {
    message: 'Le mot de passe doit contenir au moins 8 caractères',
  })
  @MaxLength(100, {
    message: 'Le mot de passe doit contenir au maximum 100 caractères',
  })
  password: string;

  @ApiProperty({ example: 'Jean', description: "Prénom de l'utilisateur" })
  @IsNotEmpty({ message: 'Le prénom est requis' })
  @IsString({ message: 'Le prénom doit être une chaîne de caractères' })
  @MinLength(2, { message: 'Le prénom doit contenir au moins 2 caractères' })
  @MaxLength(50, {
    message: 'Le prénom doit contenir au maximum 50 caractères',
  })
  @Type(() => String)
  firstName: string;

  @ApiProperty({
    example: 'Dupont',
    description: "Nom de famille de l'utilisateur",
  })
  @IsNotEmpty({ message: 'Le nom est requis' })
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  @MinLength(2, { message: 'Le nom doit contenir au moins 2 caractères' })
  @MaxLength(50, { message: 'Le nom doit contenir au maximum 50 caractères' })
  @Type(() => String)
  lastName: string;
}
