import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { AxiosError } from 'axios';
import { lastValueFrom } from 'rxjs';
import { MapleHttpException } from '../common/errors/MapleHttpException';
import { AuthServerConfig } from '../config/authServerConfig';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminRolesDto } from './dto/update-admin-role.dto';

@Injectable()
export class AdminService {
  constructor(
    @Inject(AuthServerConfig.KEY)
    private authServerConfig: ConfigType<typeof AuthServerConfig>,
    private httpService: HttpService,
  ) {}

  async updateAdminRole(data: UpdateAdminRolesDto) {
    try {
      const url = `${this.authServerConfig.url}/api/v1/admin/role`;
      const response = await lastValueFrom(this.httpService.patch(url, data));
      return response.data;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async createAdmin(data: CreateAdminDto) {
    try {
      const url = `${this.authServerConfig.url}/api/v1/admin`;
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
