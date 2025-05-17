import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { AxiosError } from 'axios';
import { lastValueFrom } from 'rxjs';
import { MapleHttpException } from '../common/errors/MapleHttpException';
import { AuthServerConfig } from '../config/authServerConfig';
@Injectable()
export class AuthService {
  constructor(
    @Inject(AuthServerConfig.KEY)
    private authServerConfig: ConfigType<typeof AuthServerConfig>,
    private httpService: HttpService,
  ) {}

  async signup(data: any) {
    try {
      const url = `${this.authServerConfig.url}/api/v1/auth/signup`;
      const response = await lastValueFrom(this.httpService.post(url, data));
      return response.data;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async login(data: any) {
    try {
      const url = `${this.authServerConfig.url}/api/v1/auth/login`;
      const response = await lastValueFrom(this.httpService.post(url, data));
      return response.data;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async refreshToken(data: any) {
    try {
      const url = `${this.authServerConfig.url}/api/v1/auth/refresh`;
      const response = await lastValueFrom(this.httpService.post(url, data));
      return response.data;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async handleError(error: any) {
    if (error instanceof AxiosError) {
      const errorData = error.response?.data;

      if (errorData.code) {
        const { code, message } = errorData;
        throw new MapleHttpException({ code, message }, error.status);
      }
    }

    throw error;
  }
}
