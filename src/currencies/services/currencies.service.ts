import { Injectable } from '@nestjs/common';

import { ConvertCurrencyDto } from '../dto/convert-currency.dto';
import { ConvertedCurrencyDto } from '../dto/converted-currency.dto';
import { ConvertCurrenciesApiResponseDto } from '../dto/convert-currencies-api-response.dto';
import { ListedCurrencyDto } from '../dto/listed-currency.dto';
import { ApiService } from './api.service';
import { CacheService } from './cache.service';
import { ListCurrenciesApiResponseDto } from '../dto/list-currencies-api-response.dto';

@Injectable()
export class CurrenciesService {
  constructor(
    private readonly apiService: ApiService,
    private readonly cacheService: CacheService,
  ) {}

  async convert(convertCurrencyDto: ConvertCurrencyDto) {
    return await this.apiService.get<ConvertCurrenciesApiResponseDto>(
      `/rest/rates/${convertCurrencyDto.source}/${convertCurrencyDto.target}`,
    );
  }

  async convertCached(convertCurrencyDto: ConvertCurrencyDto, ttl?: number) {
    if (!ttl) {
      ttl = this.secondsUntilEndOfDay();
    }
    const convertCurrencyApiResponse =
      await this.cacheService.getOrSet<ConvertCurrenciesApiResponseDto>(
        `converted-currency-${convertCurrencyDto.source}-${convertCurrencyDto.target}`,
        ttl,
        async () => {
          return await this.convert(convertCurrencyDto);
        },
      );

    return new ConvertedCurrencyDto(
      convertCurrencyDto.source,
      convertCurrencyDto.target,
      convertCurrencyDto.amount,
      convertCurrencyApiResponse.quote * convertCurrencyDto.amount,
    );
  }

  async list() {
    return (
      await this.apiService.get<ListCurrenciesApiResponseDto[]>(
        `/rest/currencies`,
      )
    )
      .filter((item) => item.active)
      .map((item) => new ListedCurrencyDto(item.code));
  }

  async listCached(ttl?: number) {
    if (!ttl) {
      ttl = this.secondsUntilEndOfDay();
    }
    return await this.cacheService.getOrSet<ListedCurrencyDto[]>(
      'currencies',
      ttl,
      async () => {
        return await this.list();
      },
    );
  }

  formati18n(locale: string = null, currency: string, value: number) {
    if (!locale) {
      locale = new Intl.NumberFormat().resolvedOptions().locale;
    }
    return Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(value);
  }

  secondsUntilEndOfDay(): number {
    const d = new Date();
    const h = d.getHours();
    const m = d.getMinutes();
    const s = d.getSeconds();
    return 24 * 60 * 60 - h * 60 * 60 - m * 60 - s;
  }
}
