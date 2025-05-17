import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ROLE_MAP } from '../../common/constants/role.constant';

@ValidatorConstraint({ name: 'isNullOrAdmin', async: false })
export class IsNullOrAdmin implements ValidatorConstraintInterface {
  validate(value: any) {
    return value === undefined || value === null || value === ROLE_MAP.ADMIN;
  }

  defaultMessage() {
    return 'role must be either empty or ADMIN';
  }
}

type AdminRole = (typeof ROLE_MAP)['ADMIN'];

export class UpdateAdminRolesDto {
  @ApiProperty({
    description: '역할을 변경할 사용자의 UUID',
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
    description: '관리자 역할 (null 값 또는 ADMIN만 허용)',
    type: String,
    enum: [ROLE_MAP.ADMIN],
    required: false,
    example: 'ADMIN',
    nullable: true,
  })
  @Validate(IsNullOrAdmin)
  role?: AdminRole;
}
