import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EVENT_STATE_MAP } from './constants/event-state.constant';
import { EventActionDto } from './dto/event-action.dto';
import { EventNotFoundException } from './errors/EventNotFoundException';
import { EventAction } from './interfaces/event-action.interface';
import {
  EventParticipant,
  EventParticipantDocument,
} from './schema/event-participant.schema';
import { Event, EventDocument } from './schema/event.schema';

@Injectable()
export class EventActionKillMonsterService
  implements EventAction<EventActionDto, void>
{
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel(EventParticipant.name)
    private eventParticipantModel: Model<EventParticipantDocument>,
  ) {}

  async execute(data: EventActionDto): Promise<void> {
    const { eventUuid, userUuid } = data;

    const event = await this.eventModel.findOne(
      { uuid: eventUuid, state: EVENT_STATE_MAP.STARTED },
      { condition: 1 },
    );
    if (!event) throw new EventNotFoundException();

    let eventParticipant = await this.eventParticipantModel.findOne({
      eventUuid,
      userUuid,
    });
    if (!eventParticipant) {
      eventParticipant = new this.eventParticipantModel({
        eventUuid,
        userUuid,
        condition: {
          uuid: event.condition.uuid,
          config: event.condition.config.map((elem) => ({
            monsterUuid: elem.monsterUuid,
            monsterName: elem.monsterName,
            killCount: 0,
          })),
        },
      });
    }

    const isCompleted = !!eventParticipant.completedAt;

    if (isCompleted) {
      return;
    }

    const requestList = data.config as any as {
      monsterUuid: string;
      monsterName: string;
      killCount: number;
    }[];

    const userConfig = eventParticipant.condition.config as Array<{
      monsterUuid: string;
      monsterName: string;
      killCount: number;
    }>;

    for (const req of requestList) {
      const target = userConfig.find((u) => u.monsterUuid === req.monsterUuid);
      if (target) {
        target.killCount += req.killCount;
      }
    }

    eventParticipant.markModified('condition.config');
    await eventParticipant.save();
  }
}
