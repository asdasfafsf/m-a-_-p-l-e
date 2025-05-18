import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { uuidv7 } from 'uuidv7';
import { EVENT_STATE_MAP } from './constants/event-state.constant';
import { EVENT_TYPE_MAP } from './constants/event.constant';
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
      { conditions: 1 },
    );
    if (!event) throw new EventNotFoundException();

    let eventParticipant = await this.eventParticipantModel.findOne({
      eventUuid,
      userUuid,
    });
    if (!eventParticipant) {
      eventParticipant = await this.eventParticipantModel.create({
        eventUuid,
        userUuid,
        conditionMap: {},
        rewardClaimedMap: {},
      });
    }

    const requestList = data.config as any as {
      monsterUuid: string;
      monsterName: string;
      killCount: number;
    }[];

    const targetConditions = event.conditions.filter(
      (elem) => elem.type === EVENT_TYPE_MAP.KILL_MONSTER,
    );

    for (const targetCondition of targetConditions) {
      const { uuid, config } = targetCondition;

      if (!eventParticipant.conditionMap[uuid]) {
        eventParticipant.conditionMap[uuid] = {
          uuid: uuidv7(),
          eventConditionUuid: uuid,
          type: targetCondition.type,
          config: (config as any[]).map((elem) => ({
            monsterUuid: elem.monsterUuid,
            monsterName: elem.monsterName,
            killCount: 0,
          })),
        };
      }

      const entry = eventParticipant.conditionMap[uuid];
      for (const req of requestList) {
        const monsterEntry = entry.config.find(
          (item) => item.monsterUuid === req.monsterUuid,
        );
        if (monsterEntry) {
          monsterEntry.killCount += req.killCount;
        }
      }
      eventParticipant.markModified(`conditionMap.${uuid}.config`);
    }

    await eventParticipant.save();
  }
}
