import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { EVENT_STATE_MAP } from '../constants/event-state.constant';
import { EventState } from '../types/event-state.type';

export class EventQueryFilterDto {
  @IsOptional()
  @IsEnum(EVENT_STATE_MAP)
  state?: EventState;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startedAt?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endedAt?: Date;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10;
}
