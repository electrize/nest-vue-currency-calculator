import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import config from '../src/main.config';
import { setupNest } from '../src/main.setup';

describe('CurrenciesController (e2e)', () => {
  let app: INestApplication;
  let server: any;
  let cookie: string;
  let token: string;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication(config);
    setupNest(app);
    await app.init();
    server = app.getHttpServer();

    await request(server)
      .get('/api/csrf-token')
      .then((res) => {
        cookie = res.headers['set-cookie'] || '';
        token = res.body || '';
      });
  });

  it('/api/currencies/list (GET) sohuld return 200 and array of objects with valid currencies codes', () => {
    return request(server)
      .get('/api/currencies/list')
      .set('_csrf', token)
      .set('Cookie', cookie)
      .expect(200)
      .expect(({ body }) => {
        expect(Array.isArray(body)).toBeTruthy();
        if (body.length > 0) {
          expect(body[0]).toBeInstanceOf(Object);
          expect(body[0]).toHaveProperty('code');
          expect(typeof body[0].code).toBe('string');
          expect(body[0].code.length).toBe(3);
        } else {
          expect(body).toStrictEqual([]);
        }
      });
  });

  it('/api/currencies/convert (POST) sohuld return 200 with valid input', () => {
    return request(server)
      .post('/api/currencies/convert')
      .set('_csrf', token)
      .set('Cookie', cookie)
      .send({
        source: 'EUR',
        target: 'GBP',
        amount: 1,
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        expect(body).toHaveProperty('source');
        expect(body).toHaveProperty('target');
        expect(body).toHaveProperty('amount');
        expect(body).toHaveProperty('quote');
        expect(body).toHaveProperty('localeQuote');

        expect(typeof body.source).toBe('string');
        expect(body.source.length).toBe(3);
        expect(typeof body.target).toBe('string');
        expect(body.target.length).toBe(3);
        expect(typeof body.amount).toBe('number');
        expect(body.amount).toBeGreaterThanOrEqual(0);
        expect(typeof body.quote).toBe('number');
        expect(body.quote).toBeGreaterThanOrEqual(0);
        expect(typeof body.localeQuote).toBe('string');
      });
  });

  it('/api/currencies/convert (POST) sohuld return 400 with invalid source', () => {
    return request(server)
      .post('/api/currencies/convert')
      .set('_csrf', token)
      .set('Cookie', cookie)
      .send({
        source: 'EUR1',
        target: 'GBP',
        amount: 1,
      })
      .expect(400);
  });

  it('/api/currencies/convert (POST) sohuld return 400 with invalid target', () => {
    return request(server)
      .post('/api/currencies/convert')
      .set('_csrf', token)
      .set('Cookie', cookie)
      .send({
        source: 'EUR',
        target: 'GBP1',
        amount: 1,
      })
      .expect(400);
  });

  it('/api/currencies/convert (POST) sohuld return 400 with invalid amount', () => {
    return request(server)
      .post('/api/currencies/convert')
      .set('_csrf', token)
      .set('Cookie', cookie)
      .send({
        source: 'EUR',
        target: 'GBP',
        amount: 'TEST',
      })
      .expect(400);
  });

  afterAll(async () => {
    await app.close();
  });
});
