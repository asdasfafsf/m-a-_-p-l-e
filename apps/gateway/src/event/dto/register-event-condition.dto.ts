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
    example: { requiredKillCount: 100 },
    description: '이벤트 조건 설정, type에 따라 구조 다름',
    type: 'object',
    additionalProperties: true,
  })
  @Validate(EventConfigValidator)
  config: any;
}
