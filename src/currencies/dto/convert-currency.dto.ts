import { IsPositive, IsDefined, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

import { IsValidCurrencyCode } from '../validators/is-valid-currency-code.validator';

export class ConvertCurrencyDto {
  @IsDefined()
  @IsValidCurrencyCode({
    message: 'source must be a valid currency code',
  })
  readonly source: string;

  @IsDefined()
  @IsValidCurrencyCode({
    message: 'target must be a valid currency code',
  })
  readonly target: string;

  @Transform((amount) => parseFloat(amount.value))
  @IsDefined()
  @IsPositive()
  readonly amount: number;

  @IsOptional()
  @IsString()
  readonly locale: string;

  constructor(source: string, target: string, amount: number, locale: string) {
    this.source = source;
    this.target = target;
    this.amount = amount;
    this.locale = locale;
  }
}
