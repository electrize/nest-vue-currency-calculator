import { Controller, Get, Post, Body } from '@nestjs/common';

import { CurrenciesService } from './services/currencies.service';
import { ConvertCurrencyDto } from './dto/convert-currency.dto';

@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @Post('convert')
  async convert(@Body() convertCurrencyDto: ConvertCurrencyDto) {
    const convertedCurrencyDto =
      await this.currenciesService.convertCached(convertCurrencyDto);

    return {
      ...convertedCurrencyDto,
      localeQuote: this.currenciesService.formati18n(
        convertCurrencyDto.locale,
        convertCurrencyDto.target,
        convertedCurrencyDto.quote,
      ),
    };
  }

  @Get('list')
  list() {
    return this.currenciesService.listCached();
  }
}
