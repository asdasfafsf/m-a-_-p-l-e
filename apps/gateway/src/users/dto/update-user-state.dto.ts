import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { USER_STATE_MAP } from '../constants/user.constant';
import { UserState } from '../types/user.type';

export class UpdateUserStateDto {
  @ApiProperty({
    description: '상태를 변경할 사용자의 UUID',
    type: String,
    format: 'uuid',
    required: true,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  uuid: string;

  @ApiProperty({
    description: '변경할 사용자 상태',
    type: String,
    enum: Object.values(USER_STATE_MAP),
    required: true,
    example: 'ACTIVE',
  })
  @IsIn(Object.values(USER_STATE_MAP))
  state: UserState;
}
