import { Injectable } from '@nestjs/common';
import { EventCondition } from './interfaces/event-condition.interface';

@Injectable()
export class EventConditionKillMonsterService
  implements EventCondition<{ eventUuid: string; userUuid: string }>
{
  constructor() {}

  async checkCondition({
    eventUuid,
    userUuid,
  }: {
    eventUuid: string;
    userUuid: string;
  }): Promise<boolean> {
    return true;
  }
}
