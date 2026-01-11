import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    description: "Informations de l'utilisateur",
    example: {
      id: 'uuid',
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'user',
      isActive: true,
      createdAt: '2024-01-01T00:00:00.000Z',
    },
  })
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    isActive: boolean;
    createdAt: Date;
  };

  @ApiProperty({
    description: "Token JWT pour l'authentification",
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;
}
