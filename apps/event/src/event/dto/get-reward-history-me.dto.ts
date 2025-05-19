import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetRewardHistoryMeQueryDto {
  @IsOptional()
  @IsString()
  eventUuid?: string;

  @IsString()
  userUuid: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number = 100;
}
