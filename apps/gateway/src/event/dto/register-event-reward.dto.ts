import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { REWARD_TYPE_MAP } from '../constants/event.reward.constant';
import { EventRewardType } from '../types/event-reward.type';

export class RegisterEventRewardDto {
  @ApiProperty({
    example: 'ITEM',
    enum: Object.values(REWARD_TYPE_MAP),
    description: '보상 타입',
  })
  @IsString()
  @IsNotEmpty()
  type: EventRewardType;

  @ApiProperty({ example: '에픽 상자', description: '보상 이름' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 10, description: '보상 수량' })
  @IsNumber()
  @IsNotEmpty()
  count: number;

  @ApiPropertyOptional({
    example: 'item-abc123',
    description: '아이템 ID (type이 ITEM일 때만 사용)',
  })
  @IsString()
  @IsOptional()
  itemId?: string;
}
