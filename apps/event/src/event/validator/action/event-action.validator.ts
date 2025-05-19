import { BadRequestException } from '@nestjs/common';
import { EVENT_TYPE_MAP } from '../../constants/event.constant';
import { EventType } from '../../types/event.type';
import { validate as validateMonsterKill } from './event-action-monster-kill.validator';

export const validate = (type: EventType, data: any) => {
  switch (type) {
    case EVENT_TYPE_MAP.KILL_MONSTER:
      return validateMonsterKill(data);
    default:
      throw new BadRequestException('Invalid event type');
  }
};
