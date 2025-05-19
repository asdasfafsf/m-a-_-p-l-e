import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    description: '이벤트 타입',
    enum: Object.values(EVENT_TYPE_MAP),
    example: 'KILL_MONSTER',
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(EVENT_TYPE_MAP)
  type: EventType;

  @ApiProperty({
    description: '이벤트 UUID',
    example: '0196e7f4-bbed-7cbb-ab64-05467d0492c4',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  eventUuid: string;

  @ApiProperty({
    description: '이벤트 액션 config, type에 따라 구조 달라짐',
    example: [
      {
        monsterUuid: '123',
        monsterName: '주황버섯',
        killCount: 500,
      },
    ],
  })
  @Validate(EventActionConfigValidator)
  config: any;
}
