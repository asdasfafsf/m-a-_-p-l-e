/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EVENT_STATE_MAP } from './constants/event-state.constant';
import { EventQueryFilterDto } from './dto/event-query-filter.dto';
import { RegisterEventDto } from './dto/register-event.dto';
import { EventNotFoundException } from './errors/EventNotFoundException';
import { EventCondition } from './schema/event-condition.schema';
import { EventReward } from './schema/event-reward.schema';
import { Event, EventDocument } from './schema/event.schema';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
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
      .select({ _id: 0, __v: 0, conditions: 0, rewards: 0 })
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
      conditions: event.conditions?.map(
        ({ _id, __v, ...rest }) => rest,
      ) as Omit<EventCondition, '_id' | '__v'>[],
      rewards: event.rewards?.map(({ _id, __v, ...rest }) => rest) as Omit<
        EventReward,
        '_id' | '__v'
      >[],
    } as unknown as Omit<Event, '_id' | '__v'>; // <- 이거까지 해줘야 타입 에러 깔끔히 제거됨
  }
}
