import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsIn, IsString, Validate } from 'class-validator';
import { EVENT_TYPE_MAP } from '../constants/event.constant';
import { EventType } from '../types/event.type';
import { EventConfigValidator } from '../validator/event-config.validator';

export class RegisterEventConditionDto {
  @ApiProperty({
    enum: Object.values(EVENT_TYPE_MAP),
    example: EVENT_TYPE_MAP.KILL_MONSTER,
  })
  @IsString()
  @IsIn(Object.values(EVENT_TYPE_MAP))
  type: EventType;

  @ApiProperty({
    example: '2025-06-01T00:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  @Type(() => Date)
  @IsDate()
  startedAt: Date;

  @ApiProperty({
    example: '2025-06-30T23:59:59.999Z',
    type: String,
    format: 'date-time',
  })
  @Type(() => Date)
  @IsDate()
  endedAt: Date;

  @ApiProperty({
    description: '이벤트 조건 설정, type에 따라 구조 다름',
    oneOf: [
      {
        type: 'array',
        description: 'KILL_MONSTER 타입 이벤트 조건',
        example: [
          {
            monsterUuid: '123',
            monsterName: '주황버섯',
            killCount: 100,
          },
        ],
      },
      {
        type: 'array',
        description: 'LOGIN 타입 이벤트 조건',
        example: [
          {
            loginCount: 5,
          },
        ],
      },
    ],
  })
  @Validate(EventConfigValidator)
  config: any;
}
