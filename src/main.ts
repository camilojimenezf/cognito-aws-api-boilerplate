import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { env } from './config/env';

async function bootstrap() {
  const logger = new Logger('Carpentry API Main');

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: '*', // ⚠️ Para producción, cambiar por el dominio del frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Si necesitas enviar cookies o encabezados de autenticación
  });

  await app.listen(env.PORT);

  logger.log(`Server is running on port ${env.PORT}`);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
