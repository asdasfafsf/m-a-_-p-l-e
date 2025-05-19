import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { EVENT_STATE_MAP } from '../constants/event-state.constant';
import { EventState } from '../types/event-state.type';

export class UpdateEventStateDto {
  @ApiProperty({
    description: '변경할 이벤트 상태',
    example: 'STARTED',
    enum: Object.values(EVENT_STATE_MAP),
  })
  @IsEnum(EVENT_STATE_MAP)
  state: EventState;
}
