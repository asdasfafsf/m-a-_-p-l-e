import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { EventRewardType } from '../types/event-reward.type';

export class RegisterEventRewardDto {
  @IsString()
  @IsNotEmpty()
  type: EventRewardType;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  count: number;

  @IsString()
  @IsOptional()
  itemId?: string;
}
