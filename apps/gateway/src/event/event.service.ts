import { HttpService } from '@nestjs/axios';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { AxiosError } from 'axios';
import { lastValueFrom } from 'rxjs';
import { MapleHttpException } from '../common/errors/MapleHttpException';
import {
  ERROR_CODE_MAP,
  ERROR_MESSAGE_MAP,
} from '../common/errors/constants/error.constant';
import { EventServerConfig } from '../config/eventServerConfig';
import { RegisterEventDto } from './dto/register-event.dto';

@Injectable()
export class EventService {
  constructor(
    @Inject(EventServerConfig.KEY)
    private readonly eventServerConfig: ConfigType<typeof EventServerConfig>,
    private readonly httpService: HttpService,
  ) {}

  async registerEvent(body: RegisterEventDto) {
    try {
      const response = await lastValueFrom(
        this.httpService.put(
          `${this.eventServerConfig.url}/api/v1/event`,
          body,
        ),
      );

      return response.data;
    } catch (error) {
      console.log(`${this.eventServerConfig.url}/api/v1/event`);
      await this.handleError(error);
    }
  }

  async handleError(error: any) {
    if (error instanceof AxiosError) {
      const errorData = error.response?.data;
      throw new MapleHttpException(
        { code: errorData.code, message: errorData.message },
        error.status,
      );
    }

    throw new MapleHttpException(
      { code: ERROR_CODE_MAP.ERROR, message: ERROR_MESSAGE_MAP.ERROR },
      error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
