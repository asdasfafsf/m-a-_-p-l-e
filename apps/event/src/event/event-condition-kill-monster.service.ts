import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MapleHttpException } from '../common/errors/MapleHttpException';
import { EventNotFoundException } from './errors/EventNotFoundException';
import { EventCondition } from './interfaces/event-condition.interface';
import {
  EventParticipant,
  EventParticipantDocument,
} from './schema/event-participant.schema';
import { Event, EventDocument } from './schema/event.schema';

@Injectable()
export class EventConditionKillMonsterService
  implements EventCondition<{ eventUuid: string; userUuid: string }>
{
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel(EventParticipant.name)
    private eventParticipantModel: Model<EventParticipantDocument>,
  ) {}

  async checkCondition({
    eventUuid,
    userUuid,
  }: {
    eventUuid: string;
    userUuid: string;
  }): Promise<boolean> {
    const event = await this.eventModel
      .findOne({ uuid: eventUuid })
      .select('condition');

    if (!event) {
      throw new EventNotFoundException();
    }

    const eventParticipant = await this.eventParticipantModel
      .findOne({
        eventUuid,
        userUuid,
      })
      .select('condition completedAt');

    if (!eventParticipant) {
      throw new MapleHttpException(
        {
          code: 'EVENT_PARTICIPANT_NOT_FOUND',
          message: 'Event participant not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (eventParticipant.completedAt) {
      return true;
    }

    const userConditionConfig = eventParticipant.condition.config as any;
    const eventConditionConfig = event.condition.config as any;

    const isCompleted = eventConditionConfig.every((elem) => {
      const userCondition = userConditionConfig.find(
        (userElem) => userElem.monsterUuid === elem.monsterUuid,
      );
      return userCondition.killCount >= elem.killCount;
    });

    if (isCompleted) {
      await this.eventParticipantModel.updateOne(
        { eventUuid, userUuid },
        { $set: { completedAt: new Date() } },
      );
      return true;
    }

    return false;
  }
}
