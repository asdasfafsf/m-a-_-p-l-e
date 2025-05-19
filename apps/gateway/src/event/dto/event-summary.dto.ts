import { ApiProperty } from '@nestjs/swagger';
import { EVENT_STATE_MAP } from '../constants/event-state.constant';
import { EventState } from '../types/event-state.type';

export class EventSummaryDto {
  @ApiProperty({ example: 'event-uuid-123' })
  uuid: string;

  @ApiProperty({ example: '출석 이벤트' })
  name: string;

  @ApiProperty({
    enum: EVENT_STATE_MAP,
    example: 'STARTED',
    description: '이벤트 상태',
  })
  state: EventState;

  @ApiProperty({ example: '2025-06-01T00:00:00.000Z', format: 'date-time' })
  startedAt: Date;

  @ApiProperty({ example: '2025-06-30T23:59:59.999Z', format: 'date-time' })
  endedAt: Date;
}
