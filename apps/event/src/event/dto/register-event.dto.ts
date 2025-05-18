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
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDate()
  @Type(() => Date)
  startedAt: Date;

  @IsDate()
  @Type(() => Date)
  endedAt: Date;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => RegisterEventConditionDto)
  conditions: RegisterEventConditionDto[];

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => RegisterEventRewardDto)
  rewards: RegisterEventRewardDto[];
}
