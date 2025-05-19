import { BadRequestException, Injectable } from '@nestjs/common';
import { EVENT_TYPE_MAP } from './constants/event.constant';
import { EventConditionKillMonsterService } from './event-condition-kill-monster.service';
import { EventType } from './types/event.type';

@Injectable()
export class EventConditionFactory {
  constructor(
    private readonly eventConditionKillMonsterService: EventConditionKillMonsterService,
  ) {}

  getCondition(type: EventType) {
    switch (type) {
      case EVENT_TYPE_MAP.KILL_MONSTER:
        return this.eventConditionKillMonsterService;
      default:
        throw new BadRequestException(`Invalid event type: ${type}`);
    }
  }
}
