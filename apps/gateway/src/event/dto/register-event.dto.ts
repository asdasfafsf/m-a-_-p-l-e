import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { RegisterEventConditionDto } from './register-event-condition.dto';
import { RegisterEventRewardDto } from './register-event-reward.dto';

export class RegisterEventDto {
  @ApiProperty({ example: '출석 이벤트' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '매일 접속하면 보상 지급' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: '2025-06-01T00:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  @IsDate()
  @Type(() => Date)
  startedAt: Date;

  @ApiProperty({
    example: '2025-06-30T23:59:59.999Z',
    type: String,
    format: 'date-time',
  })
  @IsDate()
  @Type(() => Date)
  endedAt: Date;

  @ApiProperty({ type: RegisterEventConditionDto })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => RegisterEventConditionDto)
  condition: RegisterEventConditionDto;

  @ApiProperty({ type: [RegisterEventRewardDto] })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => RegisterEventRewardDto)
  rewards: RegisterEventRewardDto[];
}
