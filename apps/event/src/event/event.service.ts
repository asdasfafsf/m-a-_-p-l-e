/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MapleHttpException } from 'apps/auth/src/common/errors/MapleHttpException';
import { Model } from 'mongoose';
import { EVENT_STATE_MAP } from './constants/event-state.constant';
import { ClaimRewardDto } from './dto/claim-reward-dto';
import { EventQueryFilterDto } from './dto/event-query-filter.dto';
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
import { EventState } from './types/event-state.type';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel(EventParticipant.name)
    private eventParticipantModel: Model<EventParticipantDocument>,
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

  async claimReward({
    eventUuid,
    userUuid,
  }: ClaimRewardDto & { eventUuid: string }) {
    const event = await this.eventModel
      .findOne({ uuid: eventUuid, state: EVENT_STATE_MAP.STARTED })
      .select('rewards')
      .lean();
    if (!event) throw new EventNotFoundException();

    const eventParticipant = await this.eventParticipantModel
      .findOne({ eventUuid, userUuid })
      .select('claimedRewards completedAt')
      .lean();

    if (!eventParticipant) {
      throw new MapleHttpException(
        { code: 'NOT_FOUND', message: 'Event participant not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    if (!eventParticipant.completedAt) {
      throw new MapleHttpException(
        { code: 'EVENT_NOT_COMPLETED', message: 'Event not completed' },
        HttpStatus.BAD_REQUEST,
      );
    }

    console.log(eventParticipant.claimedRewards);

    const claimedSet = new Set(
      eventParticipant.claimedRewards.map((c) => c.rewardUuid),
    );

    const unClaimedRewards = event.rewards.filter(
      (r) => !claimedSet.has(r.uuid),
    );

    if (unClaimedRewards.length === 0)
      throw new MapleHttpException(
        { code: 'NO_UNCLAIMED_REWARDS', message: 'No unclaimed rewards' },
        HttpStatus.BAD_REQUEST,
      );

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
      }
    }

    return claimed;
  }
}
