import { ApiProperty } from '@nestjs/swagger';
import { EventRewardHistoryDto } from './event-reward-histroy.dto';

export class EventRewardHistoryListDto {
  @ApiProperty({
    type: [EventRewardHistoryDto],
    description: '보상 수령 내역 목록',
  })
  rewardHistory: EventRewardHistoryDto[];

  @ApiProperty({
    example: 1,
    description: '보상 수령 내역 목록 총 개수',
  })
  totalCount: number;

  @ApiProperty({
    example: 1,
    description: '보상 수령 내역 목록 총 페이지 수',
  })
  totalPage: number;

  @ApiProperty({
    example: 1,
    description: '현재 페이지',
  })
  currentPage: number;
}
