import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetRewardHistoryMeQueryDto {
  @IsOptional()
  @IsString()
  eventUuid?: string;

  @IsString()
  userUuid: string;

  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  limit?: number = 100;
}
