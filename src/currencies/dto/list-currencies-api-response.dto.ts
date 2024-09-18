export class ListCurrenciesApiResponseDto {
  code: string;
  active: boolean;

  constructor(active: boolean, code: string) {
    this.active = active;
    this.code = code;
  }
}
