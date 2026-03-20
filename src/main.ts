import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/infrastructure/http/filters/http-exception.filter';
import { ResponseInterceptor } from './shared/infrastructure/http/interceptors/response.interceptor';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const config = app.get(ConfigService);
  const port   = config.get<number>('PORT', 3000);
  const env    = config.get<string>('NODE_ENV', 'development');

  // ── Serve uploads folder as static files ──────────────────
  const uploadDir = path.resolve(process.env.UPLOAD_DIR ?? 'uploads');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  app.useStaticAssets(uploadDir, { prefix: '/uploads' });

  // ── Global prefix ──────────────────────────────────────────
  app.setGlobalPrefix('api');

  // ── CORS ───────────────────────────────────────────────────
  const allowedOrigins = (config.get<string>('ALLOWED_ORIGINS', '*')).split(',').map(s => s.trim());
  app.enableCors({
    origin:      allowedOrigins.includes('*') ? true : allowedOrigins,
    methods:     ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // ── Validation pipe ────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist:            true,
      forbidNonWhitelisted: true,
      transform:            true,
      transformOptions:     { enableImplicitConversion: true },
    }),
  );

  // ── Global filters & interceptors ──────────────────────────
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  // ── Swagger ────────────────────────────────────────────────
  const swaggerEnabled = (process.env.SWAGGER_ENABLED ?? 'true') !== 'false';
  if (swaggerEnabled) {
    const swaggerPath = process.env.SWAGGER_PATH ?? 'api/docs';
    const swaggerConfig = new DocumentBuilder()
      .setTitle('OptimaTech-Smart API')
      .setDescription('API REST — Tienda de accesorios tecnológicos')
      .setVersion('2.0')
      .addTag('categories', 'Gestión de categorías')
      .addTag('products',   'Gestión de productos')
      .addTag('orders',     'Gestión de pedidos')
      .addTag('files',      'Subida de imágenes')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(swaggerPath, app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
    console.log(`📖  Swagger: http://localhost:${port}/${swaggerPath}`);
  }

  await app.listen(port, '0.0.0.0');
  console.log(`🚀  OptimaTech-Smart API → http://localhost:${port}/api`);
  console.log(`🌿  Entorno: ${env}`);
}

bootstrap();
