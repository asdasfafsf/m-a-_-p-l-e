import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  Validate,
} from 'class-validator';
import { EVENT_TYPE_MAP } from '../constants/event.constant';
import { EventType } from '../types/event.type';
import { EventActionConfigValidator } from '../validator/action/event-action-config.validator';

export class EventActionDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(EVENT_TYPE_MAP)
  type: EventType;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  eventUuid: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  userUuid: string;

  @Validate(EventActionConfigValidator)
  config: any;
}
