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
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  limit?: number = 100;
}
