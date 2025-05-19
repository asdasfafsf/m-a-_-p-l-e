import { ApiProperty } from '@nestjs/swagger';
import { EventRewardDto } from './event-reward.dto';

export class EventRewardHistoryDto {
  @ApiProperty({
    example: '0196e50c-25c0-7930-9dcb-1158d341ac07',
    description: '유저 UUID',
  })
  userUuid: string;

  @ApiProperty({
    example: '0196e50c-744b-75ae-814e-9a193b212c92',
    description: '이벤트 UUID',
  })
  eventUuid: string;

  @ApiProperty({ example: true, description: '보상 요청 성공 여부' })
  success: boolean;

  @ApiProperty({
    example: '2025-05-19T14:32:58.255Z',
    description: '요청 생성 시간',
  })
  createdAt: string;

  @ApiProperty({
    example: '2025-05-19T14:32:58.255Z',
    description: '보상 수령 시간',
  })
  claimedAt: string;

  @ApiProperty({ example: '', description: '실패 사유 (성공 시 빈 문자열)' })
  failedReason: string;

  @ApiProperty({ type: [EventRewardDto], description: '보상 목록' })
  rewards: EventRewardDto[];
}
