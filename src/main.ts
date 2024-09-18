import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import { csrfSync } from 'csrf-sync';
import * as session from 'express-session';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  const configService = app.get<ConfigService>(ConfigService);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.use(
    session({
      secret: configService.get<string>('SESSION_SECRET', 'mysecret'),
      resave: true,
      saveUninitialized: true,
      // store: sessionStore,
    }),
  );

  // CSRF
  const { csrfSynchronisedProtection, generateToken } = csrfSync({
    getTokenFromRequest: (req) => {
      return req.headers['_csrf'] as string;
    },
    ignoredMethods: [],
  });
  app.use((request: Request, response: Response, next: NextFunction) => {
    if (request.url.startsWith('/api')) {
      return csrfSynchronisedProtection(request, response, next);
    }
    if (request.url === '/csrf-token') {
      return response.json(generateToken(request));
    }
    if (request.url === '/') {
      generateToken(request, true);
    }
    next();
  });

  // CSP
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
        },
      },
    }),
  );

  // CORS
  app.enableCors({
    credentials: true,
    origin: true,
  });

  await app.listen(process.env.PORT ? parseInt(process.env.PORT) : 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
