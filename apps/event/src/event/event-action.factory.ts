import { BadRequestException, Injectable } from '@nestjs/common';
import { EVENT_TYPE_MAP } from './constants/event.constant';
import { EventActionKillMonsterService } from './event-action-kill-monster.service';
import { EventType } from './types/event.type';

@Injectable()
export class EventActionFactory {
  constructor(
    private readonly eventActionKillMonsterService: EventActionKillMonsterService,
  ) {}

  getAction(type: EventType) {
    switch (type) {
      case EVENT_TYPE_MAP.KILL_MONSTER:
        return this.eventActionKillMonsterService;
      default:
        throw new BadRequestException('Invalid event type');
    }
  }
}
