import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Configuration CORS complète
  app.enableCors({
    origin: [
      'http://localhost:3001', // Next.js dev
      'http://localhost:3000', // Alternative Next.js port
      'http://127.0.0.1:3001',
      'http://127.0.0.1:3000',
      process.env.FRONTEND_URL || 'http://localhost:3001', // URL frontend depuis .env
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
    ],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      transform: true,
      forbidNonWhitelisted: false,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // NE PAS utiliser ClassSerializerInterceptor globalement
  // pour éviter de filtrer le access_token

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
        bearerFormat: 'jwt',
        description: 'Entrez votre token JWT',
      },
      'jwt',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Sauvegarder le JSON dans un fichier (optionnel)
  fs.writeFileSync('./swagger-spec.json', JSON.stringify(document, null, 2));

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    jsonDocumentUrl: '/api/docs-json',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/api/docs`);
  console.log(`Swagger JSON: http://localhost:${port}/api/docs-json`);
  console.log('Swagger JSON file saved: ./swagger-spec.json');
}
bootstrap();
