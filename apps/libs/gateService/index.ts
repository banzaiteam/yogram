import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class GateService {
  readonly env: boolean;
  readonly usersHttpService: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    // FIXME check env and route path on k8s
    this.env =
      this.configService.get('NODE_ENV') === 'DEVELOPMENT' ||
      this.configService.get('NODE_ENV') === 'TESTING';
    this.usersHttpService = this.env
      ? `http://localhost:${this.configService.get('USERS_PORT')}/api/v1`
      : `${this.configService.get('USERS_PROD_SERVICE_URL')}/api/v1`;
  }

  async usersHttpServicePost(path, payload, headers) {
    try {
      const { data } = await lastValueFrom(
        this.httpService.post(
          [this.usersHttpService, path].join('/'),
          payload,
          {
            headers,
          },
        ),
      );
      return data;
    } catch (error) {
      console.warn('error postAdapter', error);
      throw new HttpException(error.message, error.response.status);
    }
  }

  async usersHttpServicePatch(path, payload, headers) {
    try {
      const { data } = await lastValueFrom(
        this.httpService.patch(
          [this.usersHttpService, path].join('/'),
          payload,
          {
            headers,
          },
        ),
      );
      return data;
    } catch (error) {
      console.warn('error postAdapter', error);
      throw new HttpException(error.message, error.response.status);
    }
  }

  async usersHttpServiceGet(path: string, headers) {
    try {
      const url = [this.usersHttpService, path].join('/');
      const { data } = await lastValueFrom(
        this.httpService.get(url, { headers }),
      );
      return data;
    } catch (error) {
      console.warn('error getAdapter', error);
      throw new HttpException(error.message, error.response.status);
    }
  }

  async httpServicePost(path, payload, headers) {
    try {
      const { data } = await lastValueFrom(
        this.httpService.post(path, payload, {
          headers,
        }),
      );
      return data;
    } catch (error) {
      console.warn('error postAdapter', error);
      throw new HttpException(error.message, error.response.status);
    }
  }

  async httpServiceGet(path: string, headers) {
    try {
      const { data } = await lastValueFrom(
        this.httpService.get(path, { headers }),
      );
      return data;
    } catch (error) {
      console.warn('error getAdapter', error);
      throw new HttpException(error.message, error.response.status);
    }
  }
}
