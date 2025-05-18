import { Type } from 'class-transformer';
import { IsDate, IsIn, IsString, Validate } from 'class-validator';
import { EVENT_TYPE_MAP } from '../constants/event.constant';
import { EventType } from '../types/event.type';
import { EventConfigValidator } from '../validator/event-config.validator';

export class RegisterEventConditionDto {
  @IsString()
  @IsIn(Object.values(EVENT_TYPE_MAP))
  type: EventType;

  @Type(() => Date)
  @IsDate()
  startedAt: Date;

  @Type(() => Date)
  @IsDate()
  endedAt: Date;

  @Validate(EventConfigValidator)
  config: any;
}
