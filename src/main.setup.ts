import {
  ValidationPipe,
  // VersioningType,
  INestApplication,
} from '@nestjs/common';
import { useContainer } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import * as session from 'express-session';
import helmet from 'helmet';
import { AppModule } from './app.module';

export function setupNest(app: INestApplication): INestApplication {
  const configService = app.get(ConfigService);

  // Class Validator
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');
  //   app.enableVersioning({
  //     type: VersioningType.URI,
  //     prefix: 'v',
  //     defaultVersion: '1',
  //   });

  app.use(
    session({
      secret: configService.get<string>('SESSION_SECRET', 'mysecret'),
      resave: true,
      saveUninitialized: true,
      // store: sessionStore,
    }),
  );

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

  return app;
}
