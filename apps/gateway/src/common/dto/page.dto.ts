import { ApiProperty } from '@nestjs/swagger';

export class PageDto {
  @ApiProperty({
    description: '현재 페이지 번호',
    type: Number,
    example: 1,
  })
  currentPage: number;

  @ApiProperty({
    description: '전체 페이지 수',
    type: Number,
    example: 10,
  })
  totalPage: number;

  @ApiProperty({
    description: '전체 항목 수',
    type: Number,
    example: 100,
  })
  totalCount: number;
}
