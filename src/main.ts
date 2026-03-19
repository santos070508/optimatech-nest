import { NestFactory }          from '@nestjs/core';
import { ValidationPipe }       from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService }        from '@nestjs/config';
import { AppModule }            from './app.module';
import { HttpExceptionFilter }  from './shared/infrastructure/http/filters/http-exception.filter';
import { ResponseInterceptor }  from './shared/infrastructure/http/interceptors/response.interceptor';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'log'] });

  const config = app.get(ConfigService);
  const port   = config.get<number>('PORT', 3000);
  const env    = config.get<string>('NODE_ENV', 'development');

  // ── Global prefix ───────────────────────────────────────────
  app.setGlobalPrefix('api');

  // ── CORS ────────────────────────────────────────────────────
  const allowedOrigins = config.get<string>('ALLOWED_ORIGINS', '*').split(',');
  app.enableCors({
    origin:      env === 'production' ? allowedOrigins : true,
    methods:     ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // ── Validation pipe (global) ────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist:        true,   // elimina campos no declarados en DTO
      forbidNonWhitelisted: true,
      transform:        true,   // convierte tipos automáticamente
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ── Global filters & interceptors ───────────────────────────
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  // ── Swagger ─────────────────────────────────────────────────
  const swaggerEnabled = config.get<string>('SWAGGER_ENABLED', 'true') === 'true';
  if (swaggerEnabled) {
    const swaggerPath = config.get<string>('SWAGGER_PATH', 'api/docs');
    const swaggerConfig = new DocumentBuilder()
      .setTitle('OptimaTech-Smart API')
      .setDescription('API REST — Tienda de accesorios tecnológicos')
      .setVersion('2.0')
      .addTag('categories', 'Gestión de categorías')
      .addTag('products',   'Gestión de productos')
      .addTag('orders',     'Gestión de pedidos')
      .addTag('files',      'Subida de imágenes')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(swaggerPath, app, document, {
      swaggerOptions: { persistAuthorization: true },
    });

    console.log(`📖  Swagger disponible en: http://localhost:${port}/${swaggerPath}`);
  }

  await app.listen(port);
  console.log(`🚀  OptimaTech-Smart API corriendo en http://localhost:${port}/api`);
  console.log(`🌿  Entorno: ${env}`);
}

bootstrap();
