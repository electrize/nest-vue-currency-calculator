import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
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
    this.baseUrl = this.configService.get<string>(
      'SWOP_URL',
      'https://swop.cx',
    );
    return `${this.baseUrl}${path}?api-key=${this.apiKey}`;
  }

  async get<T>(path: string): Promise<T> {
    const url = this.getUrl(path);
    try {
      const { data } = await firstValueFrom(this.httpService.get<T>(url));
      return data;
    } catch (error) {
      if (error.response?.status === 403) {
        throw new BadRequestException(
          'This operation is currently not supported.',
        );
      }

      throw new BadRequestException('An error happened!');
    }
  }
}
