import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import config from '../src/main.config';
import { setupNest } from '../src/main.setup';
import { NestFactory } from '@nestjs/core';

describe('Static route (e2e)', () => {
  let server: any;
  beforeAll(async () => {
    const app = await NestFactory.create(AppModule, config);
    setupNest(app);
    await app.init();
    server = app.getHttpServer();
  });

  it('static route / (GET) should return 200', () => {
    return request(server).get('/').expect(200);
  });

  it('/api (GET) sohuld return 403 if csrf token is not provided', () => {
    return request(server).get('/api').expect(403);
  });

  it('/api (GET) sohuld return 404 if csrf token is provided', async () => {
    const { cookie, token } = await request(server)
      .get('/api/csrf-token')
      .then((res) => {
        return {
          cookie: res.headers['set-cookie'] || '',
          token: res.body || '',
        };
      });

    return request(server)
      .get('/api')
      .set('_csrf', token)
      .set('Cookie', cookie)
      .expect(404);
  });
});
