import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetRewardHistoryQueryDto {
  @ApiPropertyOptional({ description: '이벤트 UUID' })
  @IsOptional()
  @IsString()
  eventUuid?: string;

  @ApiPropertyOptional({ description: '유저 UUID' })
  @IsOptional()
  @IsString()
  userUuid?: string;

  @ApiPropertyOptional({ description: '페이지 번호', default: 1 })
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @ApiPropertyOptional({ description: '페이지 당 아이템 수', default: 100 })
  @IsOptional()
  @IsNumber()
  limit?: number = 100;
}
