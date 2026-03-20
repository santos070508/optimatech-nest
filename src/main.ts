import { NestFactory }             from '@nestjs/core';
import { ValidationPipe }          from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication }  from '@nestjs/platform-express';
import * as path from 'path';
import * as fs   from 'fs';
import { AppModule }           from './app.module';
import { HttpExceptionFilter } from './shared/infrastructure/http/filters/http-exception.filter';
import { ResponseInterceptor } from './shared/infrastructure/http/interceptors/response.interceptor';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const port = parseInt(process.env.PORT ?? '3000', 10);
  const env  = process.env.NODE_ENV ?? 'development';

  const uploadDir = path.resolve(process.env.UPLOAD_DIR ?? 'uploads');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  app.useStaticAssets(uploadDir, { prefix: '/uploads' });

  app.setGlobalPrefix('api');

  const rawOrigins = process.env.ALLOWED_ORIGINS ?? '*';
  app.enableCors({
    origin:      rawOrigins.trim() === '*' ? true : rawOrigins.split(',').map(s => s.trim()),
    methods:     ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, forbidNonWhitelisted: true,
    transform: true, transformOptions: { enableImplicitConversion: true },
  }));

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  if (process.env.SWAGGER_ENABLED !== 'false') {
    const swaggerPath = process.env.SWAGGER_PATH ?? 'api/docs';
    const doc = new DocumentBuilder()
      .setTitle('OptimaTech-Smart API')
      .setDescription('API REST — Tienda de accesorios tecnológicos')
      .setVersion('2.0')
      .addTag('categories').addTag('products').addTag('orders').addTag('files')
      .build();
    SwaggerModule.setup(swaggerPath, app, SwaggerModule.createDocument(app, doc));
  }

  // CRÍTICO: 0.0.0.0 para que Railway pueda alcanzar el puerto
  await app.listen(port, '0.0.0.0');
  console.log(`🚀  API lista → http://0.0.0.0:${port}/api [${env}]`);
}

bootstrap().catch(err => {
  console.error('❌ Fallo al iniciar:', err);
  process.exit(1);
});
