import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetRewardHistoryMeQueryDto {
  @ApiPropertyOptional({
    description: '조회할 이벤트 UUID (선택)',
    example: '0196e50c-744b-75ae-814e-9a193b212c92',
  })
  @IsOptional()
  @IsString()
  eventUuid?: string;

  @ApiPropertyOptional({
    description: '페이지 번호 (기본값: 1)',
    example: 1,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @ApiPropertyOptional({
    description: '페이지당 항목 수 (기본값: 100)',
    example: 100,
    default: 100,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  limit?: number = 100;
}
