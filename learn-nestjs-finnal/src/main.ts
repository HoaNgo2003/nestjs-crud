import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { TransformInterceptor } from './core/transform.interceptor';
import cookieParser from 'cookie-parser';
 
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.enableCors({
    "origin": true,
    "methods":"GET, HEAD, PUT, PATCH, DELETE, POST",
    "preflightContinue": false,
    credentials: true
  })
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.use(cookieParser());
  app.setViewEngine('ejs');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1'
  });
  app.setGlobalPrefix('api')
  const reflector = app.get(Reflector)
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalInterceptors(new TransformInterceptor(reflector))
  await app.listen(port);
}
bootstrap();
