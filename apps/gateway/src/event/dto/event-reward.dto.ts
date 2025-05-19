import { ApiProperty } from '@nestjs/swagger';

export class EventRewardDto {
  @ApiProperty({ example: 'ITEM', description: '보상 타입' })
  type: string;

  @ApiProperty({ example: '눈물', description: '보상 이름' })
  name: string;

  @ApiProperty({ example: 1, description: '보상 수량' })
  count: number;

  @ApiProperty({ example: '1', description: '아이템 ID' })
  itemId: string;

  @ApiProperty({
    example: '0196e50c-744a-71e2-80eb-2d80c552bfa3',
    description: '보상 UUID',
  })
  uuid: string;

  @ApiProperty({ example: '2025-05-18T20:18:40.845Z', description: '생성일시' })
  createdAt: string;

  @ApiProperty({ example: '2025-05-18T20:18:40.845Z', description: '수정일시' })
  updatedAt: string;
}
