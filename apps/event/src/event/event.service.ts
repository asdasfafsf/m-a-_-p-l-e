/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MapleHttpException } from 'apps/auth/src/common/errors/MapleHttpException';
import { Model } from 'mongoose';
import { EVENT_STATE_MAP } from './constants/event-state.constant';
import { ClaimRewardDto } from './dto/claim-reward-dto';
import { EventQueryFilterDto } from './dto/event-query-filter.dto';
import { GetRewardHistoryMeQueryDto } from './dto/get-reward-history-me.dto';
import { GetRewardHistoryQueryDto } from './dto/get-reward-history.dto';
import { RegisterEventRewardDto } from './dto/register-event-reward.dto';
import { RegisterEventDto } from './dto/register-event.dto';
import { EventNotFoundException } from './errors/EventNotFoundException';
import { EventNotPendingException } from './errors/EventNotPendingException';
import { EventRewardNotFoundException } from './errors/EventRewardNotFoundException';
import { EventStateUpdateNotAllowedException } from './errors/EventStateUpdateNotAllowedException';
import { EventCondition } from './schema/event-condition.schema';
import {
  EventParticipant,
  EventParticipantDocument,
} from './schema/event-participant.schema';
import { EventReward } from './schema/event-reward.schema';
import { Event, EventDocument } from './schema/event.schema';
import {
  UserRewardHistory,
  UserRewardHistoryDocument,
} from './schema/user-reward-history.schema';
import { EventState } from './types/event-state.type';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel(EventParticipant.name)
    private eventParticipantModel: Model<EventParticipantDocument>,
    @InjectModel(UserRewardHistory.name)
    private userRewardHistoryModel: Model<UserRewardHistoryDocument>,
  ) {}

  async registerEvent(body: RegisterEventDto) {
    const event = await this.eventModel.create({
      ...body,
      state: EVENT_STATE_MAP.PENDING,
    });

    //TODO: 이벤트 등록 후 스케줄러 등록해서 이벤트 시작 시간에 이벤트 시작
    //TODO: 이벤트 종료 시간에 이벤트 종료
    return event;
  }

  async getEvents(query: EventQueryFilterDto): Promise<EventDocument[]> {
    const { startedAt, endedAt, state, page = 1, limit = 10 } = query;

    const filter: any = {
      state: { $in: [EVENT_STATE_MAP.STARTED, EVENT_STATE_MAP.PENDING] },
    };

    if (state) filter.state = state;

    if (startedAt && endedAt) {
      filter.startedAt = { $lte: endedAt };
      filter.endedAt = { $gte: startedAt };
    }

    const skip = (page - 1) * limit;

    const result = await this.eventModel
      .find(filter)
      .select({ _id: 0, __v: 0, condition: 0, rewards: 0 })
      .skip(skip)
      .limit(limit)
      .lean();

    return result;
  }

  async getEvent(uuid: string) {
    const event = await this.eventModel
      .findOne({ uuid })
      .select({ _id: 0, __v: 0 })
      .lean();

    if (!event) {
      throw new EventNotFoundException();
    }

    return {
      ...event,
      condition: event.condition as Omit<EventCondition, '_id' | '__v'>,
      rewards: event.rewards?.map(({ _id, __v, ...rest }) => rest) as Omit<
        EventReward,
        '_id' | '__v'
      >[],
    } as unknown as Omit<Event, '_id' | '__v'>; // <- 이거까지 해줘야 타입 에러 깔끔히 제거됨
  }

  async assertUpdatableEvent(eventUuid: string) {
    const event = await this.eventModel
      .findOne({ uuid: eventUuid })
      .select({ state: 1 })
      .lean();

    if (!event) {
      throw new EventNotFoundException();
    }

    if (event.state !== EVENT_STATE_MAP.PENDING) {
      throw new EventNotPendingException();
    }
  }

  async registerEventReward(
    body: RegisterEventRewardDto & { eventUuid: string },
  ) {
    const { eventUuid, ...reward } = body;

    await this.assertUpdatableEvent(eventUuid);

    const result = await this.eventModel.updateOne(
      { uuid: eventUuid },
      {
        $push: {
          rewards: body,
        },
      },
    );
    return;
  }

  async deleteEventReward({
    eventUuid,
    rewardUuid,
  }: {
    eventUuid: string;
    rewardUuid: string;
  }) {
    await this.assertUpdatableEvent(eventUuid);
    const result = await this.eventModel.updateOne(
      { uuid: eventUuid },
      { $pull: { rewards: { uuid: rewardUuid } } },
    );

    if (result.acknowledged && result.modifiedCount > 0) {
      return;
    }

    throw new EventRewardNotFoundException();
  }

  async updateEventState({
    eventUuid,
    state,
  }: {
    eventUuid: string;
    state: EventState;
  }) {
    const event = await this.eventModel
      .findOne({ uuid: eventUuid })
      .select({ state: 1, startedAt: 1, endedAt: 1 })
      .lean();

    if (!event) {
      throw new EventNotFoundException();
    }

    const currentState = event.state;

    const now = new Date();

    const canUpdate =
      (currentState === EVENT_STATE_MAP.PENDING && now >= event.startedAt) ||
      (currentState === EVENT_STATE_MAP.STARTED && now >= event.endedAt);

    if (!canUpdate) {
      throw new EventStateUpdateNotAllowedException();
    }

    const result = await this.eventModel.updateOne(
      { uuid: eventUuid },
      { $set: { state } },
    );
  }

  async claimRewards({
    eventUuid,
    userUuid,
  }: ClaimRewardDto & { eventUuid: string }) {
    let success = false;
    let failedReason = '';
    const claimedRewards: EventReward[] = [];

    try {
      const event = await this.eventModel
        .findOne({ uuid: eventUuid, state: EVENT_STATE_MAP.STARTED })
        .select('rewards')
        .lean();

      if (!event) {
        failedReason = 'EVENT_NOT_FOUND';

        throw new EventNotFoundException();
      }

      const eventParticipant = await this.eventParticipantModel
        .findOne({ eventUuid, userUuid })
        .select('claimedRewards completedAt')
        .lean();

      if (!eventParticipant) {
        failedReason = 'EVENT_PARTICIPANT_NOT_FOUND';

        throw new MapleHttpException(
          {
            code: 'EVENT_PARTICIPANT_NOT_FOUND',
            message: 'Event participant not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      if (!eventParticipant.completedAt) {
        failedReason = 'EVENT_NOT_COMPLETED';

        throw new MapleHttpException(
          { code: 'EVENT_NOT_COMPLETED', message: 'Event not completed' },
          HttpStatus.BAD_REQUEST,
        );
      }

      const claimedSet = new Set(
        eventParticipant.claimedRewards.map((c) => c.rewardUuid),
      );

      const unClaimedRewards = event.rewards.filter(
        (r) => !claimedSet.has(r.uuid),
      );

      if (unClaimedRewards.length === 0) {
        failedReason = 'NO_UNCLAIMED_REWARDS';

        throw new MapleHttpException(
          { code: 'NO_UNCLAIMED_REWARDS', message: 'No unclaimed rewards' },
          HttpStatus.BAD_REQUEST,
        );
      }
      const now = new Date();
      const claimed = [];
      for (const reward of unClaimedRewards) {
        const doc = await this.eventParticipantModel.findOneAndUpdate(
          {
            eventUuid,
            userUuid,
            'claimedRewards.rewardUuid': { $ne: reward.uuid },
          },
          {
            $push: {
              claimedRewards: { rewardUuid: reward.uuid, claimedAt: now },
            },
          },
          { new: true },
        );

        if (doc) {
          claimed.push(reward);
          claimedRewards.push(reward);
        }
      }

      success = true;
      failedReason = '';

      return claimed;
    } finally {
      await this.userRewardHistoryModel.create({
        userUuid,
        eventUuid,
        success,
        rewards: claimedRewards,
        claimedAt: success ? new Date() : undefined,
        failedReason: success ? undefined : failedReason,
      });
    }
  }

  async getRewardHistorys(
    query: GetRewardHistoryMeQueryDto | GetRewardHistoryQueryDto,
  ): Promise<{
    currentPage: number;
    totalPage: number;
    totalCount: number;
    rewardHistory: {
      userUuid: string;
      eventUuid: string;
      createdAt: Date;
      success: boolean;
      claimedAt?: Date;
      failedReason?: string;
      rewards: EventReward[];
    }[];
  }> {
    const { userUuid, eventUuid, page = 1, limit = 100 } = query;
    const skip = (page - 1) * limit;

    const findQuery: any = {};
    if (userUuid) findQuery.userUuid = userUuid;
    if (eventUuid) findQuery.eventUuid = eventUuid;

    const total = await this.userRewardHistoryModel.countDocuments(findQuery);

    const rewardHistory = await this.userRewardHistoryModel
      .find(findQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return {
      currentPage: page,
      totalPage: Math.ceil(total / limit),
      totalCount: total,
      rewardHistory: rewardHistory.map(({ _id, __v, ...rest }) => {
        return {
          userUuid: rest.userUuid,
          eventUuid: rest.eventUuid,
          success: rest.success,
          createdAt: (rest as any)?.createdAt,
          claimedAt: rest?.claimedAt ?? null,
          failedReason: rest?.failedReason ?? null,
          rewards:
            (rest as any)?.rewards?.map((el) => ({
              ...el,
              _id: undefined,
              __v: undefined,
            })) ?? [],
        };
      }),
    };
  }
}
