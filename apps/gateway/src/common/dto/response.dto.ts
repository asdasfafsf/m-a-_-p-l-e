import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto<T> {
  @ApiProperty({ example: 'SUCCESS' })
  code: string;

  @ApiProperty({ example: '성공' })
  message: string;

  @ApiProperty()
  data: T;
}
