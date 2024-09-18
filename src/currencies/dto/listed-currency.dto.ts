export class ListedCurrencyDto {
  code: string;
  // active: boolean;

  constructor(code: string) {
    // this.active = active;
    this.code = code;
  }
}
