import { ApiProperty } from '@nestjs/swagger';
import { EventSummaryDto } from './event-summary.dto';

export class EventsDto {
  @ApiProperty({ type: [EventSummaryDto] })
  events: EventSummaryDto[];

  @ApiProperty({ example: 1 })
  currentPage: number;

  @ApiProperty({ example: 5 })
  totalPage: number;

  @ApiProperty({ example: 124 })
  totalCount: number;
}
