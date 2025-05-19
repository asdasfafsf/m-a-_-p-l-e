import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetRewardHistoryQueryDto {
  @IsOptional()
  @IsString()
  eventUuid?: string;

  @IsOptional()
  @IsString()
  userUuid?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number = 100;
}
