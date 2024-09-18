import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CurrenciesService } from '../services/currencies.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsValidCurrencyCodeConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly currenciesService: CurrenciesService) {}

  async validate(currency: string): Promise<boolean> {
    const list = await this.currenciesService.listCached();
    const found = list.find((item) => {
      return item.code === currency;
    });
    return !!found;
  }
}

export function IsValidCurrencyCode(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidCurrencyCodeConstraint,
    });
  };
}
