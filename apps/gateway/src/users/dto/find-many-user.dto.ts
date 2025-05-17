import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { ROLE_MAP } from '../../common/constants/role.constant';
import { Role } from '../../common/types/role.type';

export class FindManyUsersDto {
  @ApiProperty({
    description: '조회할 페이지 번호',
    type: Number,
    default: 1,
    minimum: 1,
    required: false,
    example: 1,
  })
  @IsInt()
  @Min(1, { message: '페이지는 최소 1 이상이어야 합니다' })
  @Type(() => Number)
  @IsOptional()
  page: number = 1;

  @ApiProperty({
    description: '한 페이지당 보여줄 항목 수',
    type: Number,
    default: 10,
    minimum: 1,
    maximum: 100,
    required: false,
    example: 10,
  })
  @IsInt()
  @Min(1, { message: '한 페이지당 항목 수는 최소 1 이상이어야 합니다' })
  @Max(100, { message: '한 페이지당 항목 수는 최대 100개까지 가능합니다' })
  @Type(() => Number)
  @IsOptional()
  limit: number = 10;

  @ApiProperty({
    description: '필터링할 역할 목록 (쉼표로 구분된 문자열로 전달 가능)',
    type: [String],
    enum: Object.values(ROLE_MAP),
    isArray: true,
    required: false,
    example: ['ADMIN', 'USER'],
  })
  @IsArray()
  @IsEnum(ROLE_MAP, { each: true, message: '유효하지 않은 역할입니다' })
  @IsOptional()
  @Transform(({ value }) => {
    return typeof value === 'string' ? value.split(',') : value;
  })
  roles?: Role[];
}
