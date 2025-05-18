import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EVENT_STATE_MAP } from './constants/event-state.constant';
import { RegisterEventDto } from './dto/register-event.dto';
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

  async getEvents() {
    return this.eventModel.find({
      state: { $in: [EVENT_STATE_MAP.STARTED, EVENT_STATE_MAP.PENDING] },
    });
  }
}
