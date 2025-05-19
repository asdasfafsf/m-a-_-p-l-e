import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../common/types/role.type';
import { USER_STATE_MAP } from '../constants/user.constant';
import { UserState } from '../types/user.type';

export class UserDto {
  @ApiProperty({
    description: '사용자 고유 식별자',
    type: String,
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  uuid: string;

  @ApiProperty({
    description: '사용자 이메일',
    type: String,
    format: 'email',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: '사용자 역할 목록',
    type: [String],
    example: ['USER', 'OPERATOR'],
    isArray: true,
  })
  roles: Role[];

  @ApiProperty({
    description: '계정 생성 일시',
    type: Date,
    example: '2023-05-20T08:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: '사용자 계정 상태',
    type: String,
    example: 'ACTIVE',
    enum: Object.values(USER_STATE_MAP),
  })
  state: UserState;
}
