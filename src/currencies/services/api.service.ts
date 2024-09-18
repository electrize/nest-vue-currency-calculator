import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiService {
  protected apiKey: string;
  protected baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  protected getUrl(path: string) {
    this.apiKey = this.configService.get<string>('SWOP_API_KEY');
    this.baseUrl = this.configService.get<string>('SWOP_URL');
    return `${this.baseUrl}${path}?api-key=${this.apiKey}`;
  }

  async get<T>(path: string) {
    const { data } = await firstValueFrom(
      this.httpService.get<T>(this.getUrl(path)).pipe(
        catchError((error: AxiosError) => {
          console.log(error.response.data);
          throw 'An error happened!';
        }),
      ),
    );

    return data;
  }
}
