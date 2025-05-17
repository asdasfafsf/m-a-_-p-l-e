import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsUUID } from 'class-validator';
import { ROLE_MAP } from '../../common/constants/role.constant';
import { Role } from '../../common/types/role.type';

export class UpdateUserRoleDto {
  @ApiProperty({
    description: '사용자에게 부여할 역할 목록 (ADMIN 역할은 부여할 수 없음)',
    type: [String],
    enum: Object.values(ROLE_MAP).filter((role) => role !== ROLE_MAP.ADMIN),
    isArray: true,
    required: true,
    example: ['USER', 'OPERATOR'],
  })
  @IsIn(Object.values(ROLE_MAP).filter((role) => role !== ROLE_MAP.ADMIN), {
    each: true,
  })
  roles: Role[];

  @ApiProperty({
    description: '역할을 변경할 사용자의 UUID',
    type: String,
    format: 'uuid',
    required: true,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  uuid: string;
}
