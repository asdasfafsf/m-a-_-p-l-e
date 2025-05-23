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
import { EventActionDto } from './dto/event-action.dto';
import { EventQueryFilterDto } from './dto/event-query-filter.dto';
import { GetRewardHistoryQueryDto } from './dto/get-reward-history.dto';
import { RegisterEventRewardDto } from './dto/register-event-reward.dto';
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
      await this.handleError(error);
    }
  }

  async getEvents(query: EventQueryFilterDto) {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.eventServerConfig.url}/api/v1/event`, {
          params: query,
        }),
      );

      return response.data;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async getEvent(eventUuid: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.get(
          `${this.eventServerConfig.url}/api/v1/event/${eventUuid}`,
        ),
      );

      return response.data;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async registerEventReward(
    body: RegisterEventRewardDto & { eventUuid: string },
  ) {
    try {
      const response = await lastValueFrom(
        this.httpService.post(
          `${this.eventServerConfig.url}/api/v1/event/${body.eventUuid}/reward`,
          body,
        ),
      );

      return response.data;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async deleteEventReward({
    eventUuid,
    rewardUuid,
  }: {
    eventUuid: string;
    rewardUuid: string;
  }) {
    try {
      const response = await lastValueFrom(
        this.httpService.delete(
          `${this.eventServerConfig.url}/api/v1/event/${eventUuid}/reward/${rewardUuid}`,
        ),
      );

      return response.data;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async updateEventState({
    eventUuid,
    state,
  }: {
    eventUuid: string;
    state: string;
  }) {
    try {
      const response = await lastValueFrom(
        this.httpService.patch(
          `${this.eventServerConfig.url}/api/v1/event/${eventUuid}/state`,
          { state },
        ),
      );

      return response.data;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async doAction(body: EventActionDto & { userUuid: string }) {
    try {
      const response = await lastValueFrom(
        this.httpService.post(
          `${this.eventServerConfig.url}/api/v1/event/action`,
          body,
        ),
      );

      return response.data;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async claimRewards({
    userUuid,
    eventUuid,
  }: {
    userUuid: string;
    eventUuid: string;
  }) {
    try {
      const response = await lastValueFrom(
        this.httpService.post(
          `${this.eventServerConfig.url}/api/v1/event/${eventUuid}/reward/claim`,
          { userUuid },
        ),
      );

      return response.data;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async getRewardHistoryMe(query: GetRewardHistoryQueryDto) {
    try {
      const response = await lastValueFrom(
        this.httpService.get(
          `${this.eventServerConfig.url}/api/v1/event/reward/history/me`,
          { params: query },
        ),
      );

      return response.data;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async getRewardHistoryAdmin(query: GetRewardHistoryQueryDto) {
    try {
      const response = await lastValueFrom(
        this.httpService.get(
          `${this.eventServerConfig.url}/api/v1/event/reward/history/admin`,
          { params: query },
        ),
      );

      return response.data;
    } catch (error) {
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
