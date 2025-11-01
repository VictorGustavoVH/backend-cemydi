/**
 * Vercel serverless function handler for NestJS
 * Este archivo es el punto de entrada para Vercel
 */

import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from '../src/common/filters/http-exception.filter';
import express from 'express';

// Cache de la aplicación para reutilizar entre invocaciones
let cachedApp: any = null;

async function bootstrap() {
  // Si ya tenemos la app en caché, la reutilizamos
  if (cachedApp) {
    return cachedApp;
  }

  // Crear instancia de Express
  const expressApp = express();
  
  // Crear aplicación NestJS con Express adapter
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

  // Configurar CORS - permitir todos los orígenes en producción (ajusta según necesites)
  const allowedOrigins = process.env.FRONTEND_URL 
    ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
    : ['*'];
    
  app.enableCors({
    origin: allowedOrigins.length === 1 && allowedOrigins[0] === '*' ? '*' : allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Aplicar filtro global de excepciones
  app.useGlobalFilters(new AllExceptionsFilter());

  // Habilitar validaciones globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Inicializar la aplicación
  await app.init();

  // Guardar en caché
  cachedApp = expressApp;

  return expressApp;
}

// Exportar el handler para Vercel
export default async function handler(req: any, res: any) {
  const app = await bootstrap();
  return app(req, res);
}

