import { IsEnum } from 'class-validator';
import { EVENT_STATE_MAP } from '../constants/event-state.constant';
import { EventState } from '../types/event-state.type';

export class UpdateEventStateDto {
  @IsEnum(EVENT_STATE_MAP)
  state: EventState;
}
