import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { AxiosError } from 'axios';
import { lastValueFrom } from 'rxjs';
import { MapleHttpException } from '../common/errors/MapleHttpException';
import { AuthServerConfig } from '../config/authServerConfig';
import { FindManyUsersDto } from './dto/find-many-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdateUserStateDto } from './dto/update-user-state.dto';
@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @Inject(AuthServerConfig.KEY)
    private authServerConfig: ConfigType<typeof AuthServerConfig>,
    private httpService: HttpService,
  ) {}

  async updateUserRole(data: UpdateUserRoleDto) {
    try {
      const url = `${this.authServerConfig.url}/api/v1/users/role`;
      const response = await lastValueFrom(this.httpService.patch(url, data));
      return response.data;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async findManyUsers(data: FindManyUsersDto) {
    try {
      const url = `${this.authServerConfig.url}/api/v1/users`;
      const response = await lastValueFrom(
        this.httpService.get(url, { params: data }),
      );
      return response.data;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async updateUserState(data: UpdateUserStateDto) {
    try {
      const url = `${this.authServerConfig.url}/api/v1/users/state`;
      const response = await lastValueFrom(this.httpService.patch(url, data));
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

    this.logger.error(error);
    throw error;
  }
}
