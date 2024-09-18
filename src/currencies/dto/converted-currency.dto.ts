export class ConvertedCurrencyDto {
  source: string;
  target: string;
  amount: number;
  quote: number;

  constructor(source: string, target: string, amount: number, quote: number) {
    this.source = source;
    this.target = target;
    this.amount = amount;
    this.quote = quote;
  }
}
