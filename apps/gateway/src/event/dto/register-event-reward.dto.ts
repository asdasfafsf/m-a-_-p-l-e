import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
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

  @ApiProperty({
    example: '에픽 상자',
    description: '보상 이름',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 10,
    description: '보상 수량',
    minimum: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  count: number;

  @ApiProperty({
    example: 'item-abc123',
    description: '해당 보상의 고유식별자',
  })
  @IsString()
  itemId: string;
}
