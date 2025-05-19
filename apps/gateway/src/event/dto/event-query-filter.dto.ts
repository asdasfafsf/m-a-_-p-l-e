import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { EVENT_STATE_MAP } from '../constants/event-state.constant';
import { EventState } from '../types/event-state.type';

export class EventQueryFilterDto {
  @ApiPropertyOptional({
    enum: Object.values(EVENT_STATE_MAP),
    description: '이벤트 상태 필터',
    example: 'PENDING',
  })
  @IsOptional()
  @IsEnum(EVENT_STATE_MAP)
  state?: EventState;

  @ApiPropertyOptional({
    description: '시작일 필터 (이 날짜 이후)',
    example: '2025-05-18T00:00:00.000Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startedAt?: Date;

  @ApiPropertyOptional({
    description: '종료일 필터 (이 날짜 이전)',
    example: '2025-05-30T23:59:59.999Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endedAt?: Date;

  @ApiPropertyOptional({
    description: '페이지 번호',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    description: '페이지당 항목 수',
    example: 10,
    minimum: 1,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10;
}
