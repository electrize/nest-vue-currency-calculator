import { Test, TestingModule } from '@nestjs/testing';
import { CurrenciesController } from './currencies.controller';
import { AppService } from './services/api/currencies-list-api.service';

describe('CurrenciesController', () => {
  let currenciesController: CurrenciesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [currenciesController],
      providers: [AppService],
    }).compile();

    currenciesController = app.get<CurrenciesController>(currenciesController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(currenciesController.convert()).toBe('Hello World!');
    });
  });
});
