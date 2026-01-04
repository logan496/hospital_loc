// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Configuration Swagger
  const config = new DocumentBuilder()
    .setTitle('API Plateforme Hôpitaux')
    .setDescription(
      'API pour répertorier les hôpitaux, leurs services et permettre aux utilisateurs de les noter',
    )
    .setVersion('1.0')
    .addTag('Authentification', "Endpoints pour l'inscription et la connexion")
    .addTag('Hôpitaux', 'Endpoints pour rechercher et consulter les hôpitaux')
    .addTag(
      'Évaluations',
      'Endpoints pour créer, modifier et consulter les évaluations',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Entrez votre token JWT',
      },
      'JWT',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
  console.log('Swagger documentation: http://localhost:3000/api/docs');
}
bootstrap();
