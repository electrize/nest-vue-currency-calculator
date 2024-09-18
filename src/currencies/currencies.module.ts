import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpModule } from '@nestjs/axios';

import { CurrenciesController } from './currencies.controller';
import { CurrenciesService } from './services/currencies.service';
import { ApiService } from './services/api.service';
import { CacheService } from './services/cache.service';

import { IsValidCurrencyCodeConstraint } from './validators/is-valid-currency-code.validator';

@Module({
  imports: [CacheModule.register(), HttpModule],
  controllers: [CurrenciesController],
  providers: [
    ApiService,
    CurrenciesService,
    CacheService,
    IsValidCurrencyCodeConstraint,
  ],
})
export class CurrenciesModule {}
